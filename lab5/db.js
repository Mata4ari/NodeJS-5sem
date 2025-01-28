const EventEmitter = require('events');
class DB extends  EventEmitter{
    
        data = [
            { id: 1, name: "Alice", bday: "1990-05-15" },
            { id: 2, name: "Bob", bday: "1985-10-20" },
            { id: 3, name: "Charlie", bday: "2000-03-30" },
            { id: 4, name: "Diana", bday: "1992-07-25" },
            { id: 5, name: "Ethan", bday: "1988-12-05" },
            { id: 6, name: "Fiona", bday: "1995-01-17" },
            { id: 7, name: "George", bday: "1982-04-12" },
            { id: 8, name: "Hannah", bday: "1993-08-22" },
            { id: 9, name: "Ian", bday: "1979-11-30" },
            { id: 10, name: "Julia", bday: "1994-09-09" }
        ];
    

    async select(){
        return new Promise((resolve,reject)=>{
            resolve(this.data);
        })
    }

    async commit(){
        return new Promise((resolve,reject)=>{
            resolve("commited");
        })
    }

    async insert(newUser){
        return new Promise((resolve, reject) => {
            let id = this.data.findIndex(el => el.id == newUser.id);
            if (id === -1) {
                this.data.push(newUser);
                resolve(newUser);
            } else {
                reject(createError("id уже занят"));
            }
        })
    }

    async update (newUser){
        return new Promise((resolve, reject) => {
            let id = this.data.findIndex(el => el.id == newUser.id);
            if (id !== -1) {
                this.data[id] = newUser;
                resolve(newUser);
            } else {
                reject(createError("такого id не существует"));
            }
        });
    }

    async delete (id){
        return new Promise((resolve,reject)=>{
            let index = this.data.findIndex(el=>el.id==id);
            if (index !== -1) {
                const deletedPerson = this.data.splice(index, 1)[0];
                resolve(deletedPerson); 
            } else {
                reject(createError("такого id не существует"));
            }
        })
    }
}

module.exports.DB=DB;