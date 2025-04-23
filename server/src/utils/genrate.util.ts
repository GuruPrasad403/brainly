import shortid from 'shortid'
const genrateUnique : ()=>string = ()=>{
try {
    const id:string = shortid.generate(); 
    const trim:string = id?.slice(0,6)
    return trim
} catch (error) {
    console.log(error)
    return ""
}
}

export default genrateUnique
