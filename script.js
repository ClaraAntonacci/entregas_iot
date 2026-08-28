let graficoDiario;
let graficoSemanal;

async function carregarCSV() {

    try {

        console.log("Tentando carregar dados.csv...");

        const resposta = await fetch("./dados.csv");

        if (!resposta.ok) {
            throw new Error(
                `Não foi possível encontrar o dados.csv. Status: ${resposta.status}`
            );
        }

        let texto = await resposta.text();

 
        texto = texto.replace(/^\uFEFF/, "");

        const linhas = texto
            .trim()
            .split(/\r?\n/);

        console.log("Quantidade de linhas encontradas:", linhas.length);

        if (linhas.length <= 1) {
            throw new Error("O arquivo dados.csv está vazio.");
        }

        const dados = [];

        
        for (let i = 1; i < linhas.length; i++) {

            if (!linhas[i].trim()) {
                continue;
            }

            const partes = linhas[i].split(";");

            if (partes.length < 3) {
                console.warn("Linha ignorada:", linhas[i]);
                continue;
            }

            const data = partes[0].trim();
            const hora = partes[1].trim();
            const semana = Number(partes[2].trim());

            dados.push({
                data: data,
                hora: hora,
                semana: semana
            });
        }

        console.log("Dados carregados:", dados.length);

        if (dados.length === 0) {
            throw new Error("Nenhum registro válido foi encontrado no CSV.");
        }

        preencherTabela(dados);
        criarGraficos(dados);

    } catch (erro) {

        console.error("ERRO:", erro);

        document.body.innerHTML += `
            <div style="
                width: 90%;
                max-width: 700px;
                margin: 30px auto;
                padding: 20px;
                background: #ffecec;
                border: 1px solid #e57373;
                border-radius: 5px;
                font-family: Arial;
            ">
                <h3>Erro ao carregar os dados</h3>
                <p>${erro.message}</p>

                <p>
                    Verifique se o arquivo
                    <strong>dados.csv</strong>
                    está na mesma pasta do index.html.
                </p>
            </div>
        `;
    }
}




function preencherTabela(dados) {

    const tabela = document.getElementById("tabelaDados");

    tabela.innerHTML = "";

    dados.forEach(registro => {

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${registro.data}</td>
            <td>${registro.hora}</td>
            <td>${registro.semana}</td>
        `;

        tabela.appendChild(linha);
    });
}




function criarGraficos(dados) {

    const dias = {};
    const semanas = {};

    dados.forEach(registro => {

        if (!dias[registro.data]) {
            dias[registro.data] = 0;
        }

        dias[registro.data]++;


        if (!semanas[registro.semana]) {
            semanas[registro.semana] = 0;
        }

        semanas[registro.semana]++;
    });


 

    const labelsDias = Object.keys(dias);

    const valoresDias = labelsDias.map(data => {
        return dias[data];
    });



    const numerosSemanas = Object.keys(semanas)
        .sort((a, b) => Number(a) - Number(b));

    const labelsSemanas = numerosSemanas.map(numero => {
        return `Semana ${numero}`;
    });

    const valoresSemanas = numerosSemanas.map(numero => {
        return semanas[numero];
    });


    console.log("Dados diários:", dias);
    console.log("Dados semanais:", semanas);




    if (graficoDiario) {
        graficoDiario.destroy();
    }

    graficoDiario = new Chart(
        document.getElementById("graficoDiario"),
        {
            type: "bar",

            data: {

                labels: labelsDias,

                datasets: [{
                    label: "Aberturas",
                    data: valoresDias,

                    backgroundColor: "#176582",

                    borderWidth: 0
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }
                },

                scales: {

                    x: {

                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            autoSkip: false,
                            font: {
                                size: 9
                            }
                        },

                        grid: {
                            display: false
                        }
                    },

                    y: {

                        beginAtZero: true,

                        ticks: {
                            precision: 0
                        },

                        title: {
                            display: true,
                            text: "Quantidade de aberturas"
                        }
                    }
                }
            }
        }
    );



    if (graficoSemanal) {
        graficoSemanal.destroy();
    }

    graficoSemanal = new Chart(
        document.getElementById("graficoSemanal"),
        {
            type: "bar",

            data: {

                labels: labelsSemanas,

                datasets: [{
                    label: "Aberturas",
                    data: valoresSemanas,

                    backgroundColor: "#176582",

                    borderWidth: 0
                }]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {
                        display: false
                    }
                },

                scales: {

                    x: {

                        grid: {
                            display: false
                        }
                    },

                    y: {

                        beginAtZero: true,

                        ticks: {
                            precision: 0
                        },

                        title: {
                            display: true,
                            text: "Quantidade de aberturas"
                        }
                    }
                }
            }
        }
    );
}



carregarCSV();