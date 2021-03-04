var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
 
  type Cliente {
    id: ID!
    nome: String
    endereco: String
    sobrenome: String
    telefone: String
    email: String
  }
 
  type Query {
    getCliente(id: ID!): Cliente
    getAllClients: [Cliente]

    
  }
 
`);
 
// If Message had any complex fields, we'd put them on this object.
class Cliente {
  constructor(id, {nome, sobrenome,endereco,telefone,email}) {
    this.id = id;
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.endereco = endereco;
    this.telefone = telefone;
    this.email = email;
  }
}
 
// Maps username to content
var fakeDatabase = {
};

fakeDatabase[0] = {id: 1,nome:"Pedro", sobrenome:"Silva", telefone:"(11)-0011-222", endereco:"Av. Paulista 1234",email:"pedro.silva@gmail.com"}
fakeDatabase[1] = {id:2,nome:"Maria", sobrenome:"Pereira", telefone:"(11)-3333-444", endereco:"Av. Rebouças 5678",email:"Maria.Pereira@gmail.com"}
fakeDatabase[2] = {id:3,nome:"Paulo", sobrenome:"Coelho", telefone:"(11)-777-999", endereco:"Av. Faria Lima 10",email:"Paulo.Coelho@gmail.com"}
 
var root = {
    getCliente: ({id}) => {
    if (!fakeDatabase[id]) {
      throw new Error('no client exists with id ' + id);
    }
    return new Cliente(id, fakeDatabase[id]);
  },
  getAllClients: () => {

    var clients =[];
    for (let index = 0; index < 3; index++) {
      
        clients[index] =new Cliente(index+1, fakeDatabase[index]);
    }

    return clients;
  }
 
};
 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => {
  console.log('Running a GraphQL API server at localhost:4000/graphql');
});