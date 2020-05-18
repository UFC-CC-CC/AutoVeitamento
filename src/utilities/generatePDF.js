

const pdfGen = {
    generateTestPDF: function(state, output_file){

        let blocks_string = "";
        let counter = 1;
        for(let i in state.origin){
            // Uso o de origem como um ponto de partida, tanto faz nesse momento

            // Descubro qual dos blocos tem maior e menor cardinalidade. Preciso usar o maior deles como comparativo

            let bigger;
            let smaller;

            if(state.origin[i].length >= state.destiny[i].length){
                bigger = state.origin[i];
                smaller = state.destiny[i];
            }
            else{
                bigger = state.destiny[i];
                smaller = state.origin[i];
            }

            if(bigger.length > 1){
                blocks_string+=`\\multirow{${bigger.length}}{*}{${counter}}`;
            }
            else{
                blocks_string+=`${counter}`
            }

            // Percorro o de maior cardinalidade:
            for(let j in bigger){
                state.origin[i][j]?blocks_string+=state.origin[i][j]:blocks_string+="& & & &";
                state.destiny[i][j]?blocks_string+=state.destiny[i][j]:blocks_string+="& & &";
                blocks_string+="\\\\";
            }
            if(i != Object.keys(state.origin)[Object.keys(state.origin).length -1])
                blocks_string += " \\hline \\hline\n";
            counter ++;
        }
        blocks_string += " \\hline";

        let latex_text = `% PARA COMPILAR: executar "pdflatex relatorio.tex" duas vezes.
    
        \\documentclass[12pt,a4paper,landscape]{article}
        
        \\usepackage[utf8]{inputenc}       % CODIFICAÇÃO do arquivo
        \\usepackage[brazil]{babel}        % IDIOMA do texto
        \\usepackage[margin=2cm]{geometry} % MARGENS do documento
        \\usepackage{longtable}
        \\usepackage{multirow}
        \\usepackage{array}
        \\usepackage{fancyhdr} \\pagestyle{fancyplain}
        \\usepackage{lastpage}
        
        \\begin{document}
        %
        \\renewcommand{\\headrulewidth}{0pt}%
        %
        \\fancyfoot[C]{\\thepage\\ / \\pageref{LastPage}}%
        %
        \\begin{center}
        %
        {\\sf\\bf\\LARGE REGISTRO DE APROVEITAMENTO DE ESTUDOS\\par}
        
        \\vspace{2\\baselineskip}
        
        % ------------------------------------------------------------------------------
        \\begin{tabular}{@{}|m{5,2cm}@{\\ }m{13,25cm}|m{5,5cm}|@{}}
        \\hline
        NOME: &  ${state.nomeAluno}
        & MATRÍCULA: ${state.matriculaAluno}
        \\\\ \\hline
        CURSO/IES DE DESTINO:
        & \\multicolumn{2}{@{}m{18,75cm}|}
        {% INÍCIO
        ${state.cursoDestino} /
        ${state.instituicaoDestino}
        }%FIM
        \\\\ \\hline
        IES DE ORIGEM:
        & \\multicolumn{2}{@{}m{18,75cm}|}{${state.instituicaoOrigem}}
        \\\\ \\hline
        NÚMERO DO PROCESSO:
        & \\multicolumn{2}{@{}m{18,75cm}|}{${state.numeroProcesso}}
        \\\\ \\hline
        \\end{tabular}
        % ------------------------------------------------------------------------------
        
        \\vspace{\\baselineskip}
        
        % ------------------------------------------------------------------------------
        \\begin{longtable}
        {% INÍCIO da Especificação das Colunas
        |>{\\centering}m{1cm}
        ||>{\\centering}m{1,4cm}
        |>{\\centering}m{7,25cm}
        |>{\\centering}m{0,9cm}
        |>{\\centering}m{1cm} % Tem que ser suficiente para 3 dígitos de carga horária.
        ||>{\\centering}m{7,25cm}
        |>{\\centering}m{0,9cm}
        |m{1,6cm}|
        }% FIM da Especificação das Colunas
        \\hline
        \\multirow{2}{*}{Bloco} &
        \\multicolumn{4}{c||}{\\textbf{Componentes Cursados na IES de Origem}} &
        \\multicolumn{3}{c|}{\\textbf{Componentes Integralizados via Aproveitamento}}
        \\\\ \\cline{2-8}
        & Período & Componente Curricular & Nota & CH
        & Componente Curricular & Nota & CH Apr.
        \\\\ \\hline \\hline
        \\endhead % FIM DO CABEÇALHO DA TABELA (IRÁ REPETIR EM TODA PÁGINA)
        % AQUI COMEÇAM OS BLOCOS

        ${blocks_string}
       
        \\end{longtable}
        % ------------------------------------------------------------------------------
        
        \\vfill
        
        \\begin{tabular}{rc}
        ${state.cidade}, ${state.dia} de ${state.mes} de ${state.ano}, & \\rule{10cm}{1pt}
        \\\\
        & ${state.cargo}
        \\end{tabular}
        
        \\end{center}
        \\end{document}
        `;

        const electron = window.require('electron');
	    const fs = electron.remote.require('fs');
        const latex = electron.remote.require('node-latex');
        const currentDate = new Date(new Date().getTime() - 10800000);

        const dateString = currentDate.getFullYear() + "-" + ((currentDate.getMonth()+1) < 10 ?'0'+(currentDate.getMonth()+1):(currentDate.getMonth()+1)) + "-"+(currentDate.getDate() < 10? '0'+currentDate.getDate() : currentDate.getDate());
        
        try{
            if(!fs.existsSync(`./Relatorios Gerados/`)){
                fs.mkdirSync(`./Relatorios Gerados/`);
            }
            if(!fs.existsSync(`./Relatorios Gerados/${dateString}`)){
                fs.mkdirSync(`./Relatorios Gerados/${dateString}`);
            }    
        }
        catch(e){
            alert("Ocorreu um erro ao criar arquivos!")
            alert(e.message)
            alert(e.code)
        }
        const output = fs.createWriteStream(`./Relatorios Gerados/${dateString}/${output_file}${currentDate.getTime()}.pdf`);
        const pdf = latex(latex_text, {passes: 2});
        pdf.pipe(output);
        pdf.on('error', err => alert(err));
        pdf.on('finish', () => null);
    }
}

export default pdfGen;