import { createClient } from '@supabase/supabase-js'
import { readable, writable, type Readable } from 'svelte/store'

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

export let user = readable(supabase.auth.user(), set => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event == 'SIGNED_OUT') {
      set(null)
    } 
    if (session != null) {
      set(session.user)
    } 
  })
})

let empty: any[] | undefined = []
let emptyA = {}

export let current_market = writable({id: 0, creator_id: "", patrons: [], name: "", description: ""})
export let current_shop = writable({id: 0, creator_id: "", market_id: "", name: "", description: ""})
export let current_item = writable({id: 0, creator_id: "", shop_id: "", name: "", description: "", price: 0})


export let market_list = writable(empty)
export let shop_list = writable(empty)
export let item_list = writable(empty)
export let patron_list = writable(empty)


export const auth = supabase.auth



export async function init() {
  market_list.set(await getMarkets())
  shop_list.set(await getShops())
  item_list.set(await getItems())
  patron_list.set(await getPatrons())
}


///////////////////////////////////////
//
//        GET
//
///////////////////////////////////////

export async function getMarkets() {
  const { data, error } = await supabase
    .from('markets')
    .select()
  if (error) throw new Error(error.message)
  return data
}

export async function getShops() {
  const { data, error } = await supabase
    .from('shops')
    .select()
  if (error) throw new Error(error.message)
  return data
}

export async function getItems() {
  const { data, error } = await supabase
    .from('items')
    .select()
  if (error) throw new Error(error.message)
  return data
}

export async function getPatrons() {
  const { data, error } = await supabase
    .from('patrons')
    .select()
  if (error) throw new Error(error.message)
  return data
}

///////////////////////////////////////
//
//        INSERT
//
///////////////////////////////////////

export async function newMarket(name:string, description:string, creator_id: string) {
  const { data, error } = await supabase
    .from('markets')
    .insert([
      { name: name, description: description, creator_id: creator_id}
    ])
  if (error) {
    alert(error.message)
    throw new Error(error.message)    
  }

  market_list.set(await getMarkets())
  shop_list.set(await getShops())
  item_list.set(await getItems())
}

export async function newShop(name:string, description:string, creator_id: string, market_id: number) {
  const { data, error } = await supabase
    .from('shops')
    .insert([
      { name: name, description: description, creator_id: creator_id, market_id: market_id}
    ])
  if (error) {
    alert(error.message)
    throw new Error(error.message)    
  }

  shop_list.set(await getShops())
  item_list.set(await getItems())
}

export async function newItem(name:string, description:string, price:number, creator_id: string, shop_id: number) {
  const { data, error } = await supabase
    .from('items')
    .insert([
      { name: name, description: description, price: price, creator_id: creator_id, shop_id: shop_id}
    ])
  if (error) {
    alert(error.message)
    throw new Error(error.message)    
  }

  item_list.set(await getItems())
}

///////////////////////////////////////
//
//        DELETE
//
///////////////////////////////////////

export async function deleteMarket(id:number) {
  const {data, error } = await supabase
    .from('markets')
    .delete()
    .eq('id', id)
  

  market_list.set(await getMarkets())

  current_market.set({id: 0, creator_id: "", patrons: [], name: "", description: ""})
  current_shop.set({id: 0, creator_id: "", market_id: "", name: "", description: ""})
  current_item.set({id: 0, creator_id: "", shop_id: "", name: "", description: "", price: 0})
}

export async function deleteShop(id:number) {
  const {data, error } = await supabase
    .from('shops')
    .delete()
    .eq('id', id)
  if (error) {
    alert(error.message)
    throw new Error(error.message)
    
  }

  shop_list.set(await getShops())

  current_shop.set({id: 0, creator_id: "", market_id: "", name: "", description: ""})
  current_item.set({id: 0, creator_id: "", shop_id: "", name: "", description: "", price: 0})
}

export async function deleteItem(id:number) {
  const {data, error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)
  if (error) {
    alert(error.message)
    throw new Error(error.message)
    
  }

  item_list.set(await getItems())

  current_item.set({id: 0, creator_id: "", shop_id: "", name: "", description: "", price: 0})
}


async function getItemPrice(item_id:number) {
  const {data, error } = await supabase
    .from('items')
    .select('price')
    .eq('id', item_id)
  if (error) {
    alert(error.message)
    throw new Error(error.message) 
  }
  console.log(data[0].price)
  return data
}

async function getItem(item_id:number) {
  const {data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', item_id)
  if (error) {
    alert(error.message)
    throw new Error(error.message) 
  }
  console.log(data[0].price)
  return data
}

async function getPatronsCoins(patrons_id:number) {
  const {data, error } = await supabase
    .from('patrons')
    .select('coins')
    .eq('id', patrons_id)
  if (error) {
    alert(error.message)
    throw new Error(error.message) 
  }
  return data
}

async function getPatronsInventory(patrons_id:number) {
  const {data, error } = await supabase
    .from('patrons')
    .select('inventory_ids')
    .eq('id', patrons_id)
  if (error) {
    alert(error.message)
    throw new Error(error.message) 
  }
  return data
}

async function addItemToInventory(item:object, patron_id:number) {
  const a = await getPatronsInventory(patron_id)

  let inv = a[0].inventory_ids

  inv.push(item)

  console.log(inv)

  await supabase
    .from('patrons')
    .update({inventory_ids: inv})
    .eq('id', patron_id)

  patron_list.set(await getPatrons())
}

///////////////////////////////////////
//
//        SPECIALTY
//
///////////////////////////////////////

export async function buyItem( item_id:number, patrons_id:number ) {
  
  const a = await getItemPrice(item_id)
  const c = await getItem(item_id)
  const b = await getPatronsCoins(patrons_id)


  const item = c[0]
  const price = a[0].price
  const coins = b[0].coins

  let new_coins = coins
  if (coins >= price) {
    new_coins = coins - price
    addItemToInventory(item, patrons_id)
  }

  await supabase
    .from('patrons')
    .update({coins: new_coins})
    .eq('id', patrons_id)


  patron_list.set(await getPatrons())
}