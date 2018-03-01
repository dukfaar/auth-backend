export default async function(cache, key: string, get: (key: string) => any) {
    let result = cache.get(key)
    if(!result) {
        result = await get(key)
        cache.set(key, result)				
    }

    return result
}