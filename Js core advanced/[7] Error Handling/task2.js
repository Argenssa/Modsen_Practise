function checkObj(obj){
    try{
        let name = obj.name;
        console.log(name);
    }catch (err){
        if(err instanceof TypeError){
            console.log("object was null or undefined");
        }else throw err;
    }
    return 0;
}

let obj={name:"Sasha"}
let obj2
console.log(checkObj(obj));
console.log(checkObj(obj2));