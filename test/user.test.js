let app = require("../src/app")
let supertest = require("supertest")
let request = supertest(app)

let mainUser = {name: "Carlos Bandelli", email: "carlos@bandelli.com", password: "123456"}

beforeAll(() => {
    return request.post("/user")
    .send(mainUser)
    .then(res => {})
    .catch(err => {console.log(err)})
})

afterAll(() => {
    return request.delete(`/user/${mainUser.email}`)
    .then(res => {})
    .catch(err => {console.log(err)})
})

describe("Cadastro de úsuario", () => {
    test("Deve cadastrar um usuário com sucesso", () => {

        let time = Date.now()
        let email = `${time}@gmail.com`
        let user = {name: "Victor", email, password: "123456"}

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200)
            expect(res.body.email).toEqual(email)
        }).catch(err => {
            fail(err)
        })
    })

    test("Deve impedir que um usuário se cadastre com so dados vazios", () => {

        let user = {name: "", email: "", password: ""}

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(400)            
        }).catch(err => {
            fail(err)
        })
    })
    
    test("Deve impedir que um usuário se cadastre com um e-mail repetido", ()=>{

        let time = Date.now()
        let email = `${time}@gmail.com`
        let user = {name: "Victor", email, password: "123456"}

        return request.post("/user")
        .send(user)
        .then(res => {
            expect(res.statusCode).toEqual(200)
            expect(res.body.email).toEqual(email)

                //Segunda requisição
                return request.post("/user")
                .send(user)
                .then(res => {
                    expect(res.statusCode).toEqual(400)
                    expect(res.body.error).toEqual("E-mail já cadastrado")
                }).catch(err => {
                    fail(err)
                })
        }).catch(err => {
            fail(err)
        })
    })
})