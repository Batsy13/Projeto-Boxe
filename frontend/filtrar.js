// 1 = Masculino / 0 = Feminino
const Categorias = [
    {id:1,categoria:'Peso Mosca', genero: 1},
    {id:2,categoria:'Peso Pena', genero: 1},
    {id:3,categoria:'Peso Leve', genero: 1},
    {id:4,categoria:'Meio-Médio', genero: 1},
    {id:5,categoria:'Peso Médio', genero: 1},
    {id:6,categoria:'Meio-Pesado', genero: 1},
    {id:7,categoria:'Pesado', genero: 1},
    {id:8,categoria:'Super Pesado', genero: 1},
    {id:9,categoria:'Peso Mosca' ,genero:0},
    {id:10,categoria:'Peso Pena',genero:0},
    {id:11,categoria:'Peso Leve',genero:0},
    {id:12,categoria:'Peso Meio-Médio',genero:0},
    {id:13,categoria:'Peso Médio',genero:0}
];

        console.log(Categorias.categoria);

        const ul = document.getElementById('listaCategorias');
        Categorias.forEach((item) =>{
            const li = document.createElement("li");
            li.innerHTML = `
            <span id="item" class="categoria-name">${item.categoria}</span>
            `;
            ul.appendChild(li);
    })


const button = document.getElementById("categoria");
const tela = document.getElementById("listaCategorias")


function abrir(){

    if(button.className == "open"){
        button.className = ""
        tela.style.display = "none"
        button.value = pegar() ;
    }
    else{
        button.className = "open"
        tela.style.display = "block"
        button.innerHTML = `Categoria de Peso`
    }

}

