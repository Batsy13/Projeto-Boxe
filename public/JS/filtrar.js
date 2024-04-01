// 1 = Masculino / 0 = Feminino
const Categorias = [
    {value:1,categoria:'Peso Mosca', genero: 1},
    {value:2,categoria:'Peso Pena', genero: 1},
    {value:3,categoria:'Peso Leve', genero: 1},
    {value:4,categoria:'Meio-Médio', genero: 1},
    {value:5,categoria:'Peso Médio', genero: 1},
    {value:6,categoria:'Meio-Pesado', genero: 1},
    {value:7,categoria:'Pesado', genero: 1},
    {value:8,categoria:'Super Pesado', genero: 1},
    {value:9,categoria:'Peso Mosca' ,genero:0},
    {value:10,categoria:'Peso Pena',genero:0},
    {value:11,categoria:'Peso Leve',genero:0},
    {value:12,categoria:'Peso Meio-Médio',genero:0},
    {value:13,categoria:'Peso Médio',genero:0}
];

        console.log(Categorias.categoria);

        const ul = document.getElementById('categoria');
        Categorias.forEach((item) =>{
            const li = document.createElement("option");
            li.innerHTML = `
            <span id="item" class="categoria-name" value="${item.value}" onchange="mudar(${item.categoria})">${item.categoria}</span>
            `;
            ul.appendChild(li);
    })


const button = document.getElementById("categoria");

function mudar(itemSelecionado){
    
    button.innerHTML = `${itemSelecionado}`;

}