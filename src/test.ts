
class Pessoa {

    constructor(public name:string, public age:number){
        this.age = age
        console.log(`meu nome é ${name}`)
    }
    talk(){
        console.log('falado')
    }
}

class Filho {
    private static pessoa:Pessoa
    constructor(name:string, subname:string){
        console.log(`meu nome é: ${name} seu sobrenome é ${subname}`)
    }

    public static singleton(name:string,age:number): Pessoa  {
        if (!Filho.pessoa) {
            console.log('instancia criada')
            Filho.pessoa = new Pessoa(name,age)

        }else{

            console.log('ja existe')
        }
        return Filho.pessoa

    }
}

console.log(Filho.singleton('pedro',23).name)
console.log(Filho.singleton('lucas',25).age)
