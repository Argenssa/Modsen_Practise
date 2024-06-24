
class Rectangle{
    constructor(width, height){
        this.width = width;
        this.height = height;
    }
    perimetr(){
        return `Perimetr = ${(2*this.height+2*this.width)}`;
    }
    square(){
        return `Square = ${(this.width*this.height)}`;
    }
}

let rect = new Rectangle(20,10)
console.log(rect.perimetr());
console.log(rect.square());