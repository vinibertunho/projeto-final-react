import pg from 'pg';
import 'dotenv/config';
import pkg from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Resetando o banco de dados...');

    await prisma.respostaTentativa.deleteMany();
    await prisma.tentativaSimulado.deleteMany();
    await prisma.questao.deleteMany();
    await prisma.simulado.deleteMany();
    await prisma.conteudo.deleteMany();
    await prisma.personagem.deleteMany();
    await prisma.livro.deleteMany();
    await prisma.equipeMembro.deleteMany();
    await prisma.equipe.deleteMany();
    await prisma.usuario.deleteMany();

    console.log('📦 Inserindo Equipes e Usuários...');

    const equipeAlpha = await prisma.equipe.create({
        data: {
            nome: 'Equipe SENAI+SESI 2026',
            descricao: 'Equipe responsável pelo projeto Capitães da Areia.',
        },
    });

    const admin = await prisma.usuario.create({
        data: {
            nome: 'Coordenador Admin',
            email: 'admin@senaisesi.com',
            senhaHash: '123456',
            papel: 'ADMIN',
            idiomaPreferido: 'PT_BR',
        },
    });

    const alunoDev = await prisma.usuario.create({
        data: {
            nome: 'Vinícius Silva',
            email: 'vinicius@senai.com',
            senhaHash: '123456',
            papel: 'EDITOR',
        },
    });

    const alunoConteudo = await prisma.usuario.create({
        data: {
            nome: 'Ana Clara',
            email: 'ana@sesi.com',
            senhaHash: '123456',
            papel: 'EDITOR',
        },
    });

    await prisma.equipeMembro.createMany({
        data: [
            { equipeId: equipeAlpha.id, usuarioId: alunoDev.id, funcao: 'DEV_FULLSTACK' },
            {
                equipeId: equipeAlpha.id,
                usuarioId: alunoConteudo.id,
                funcao: 'CONTEUDISTA_BILÍNGUE',
            },
        ],
    });

    console.log('📚 Inserindo Livros e Personagens...');

    const livroPrincipal = await prisma.livro.create({
        data: {
            titulo: 'Capitães da Areia',
            autor: 'Jorge Amado',
            anoPublicacao: 1937,
            sinopse:
                'A obra retrata a vida de um grupo de menores abandonados que vivem nas ruas de Salvador.',
            capaUrl: 'https://ibb.co/6R0jzHXy.jpg',
            equipeId: equipeAlpha.id,
            isLivroPrincipal: true,
        },
    });

    await prisma.personagem.createMany({
        data: [
            {
                livroId: livroPrincipal.id,
                nome: 'Pedro Bala',
                descricao:
                    'Líder do grupo Capitães da Areia, destemido e com forte senso de justiça.',
            },
            {
                livroId: livroPrincipal.id,
                nome: 'Dora',
                descricao: 'Única figura feminina do bando, atuando como mãe e irmã dos meninos.',
            },
            {
                livroId: livroPrincipal.id,
                nome: 'Professor',
                descricao: 'O intelectual do grupo que lê livros e conta histórias.',
            },
        ],
    });

    console.log('📝 Inserindo Conteúdos e Simulados...');

    await prisma.conteudo.createMany({
        data: [
            {
                livroId: livroPrincipal.id,
                tipo: 'RESUMO',
                idioma: 'PT_BR',
                titulo: 'Resumo da Obra',
                texto: 'O livro acompanha um grupo de mais de cem meninos de rua em Salvador...',
                autorUsuarioId: alunoConteudo.id,
                publicado: true,
            },
            {
                livroId: livroPrincipal.id,
                tipo: 'RESUMO',
                idioma: 'EN',
                titulo: 'Book Summary',
                texto: 'The book follows a group of over a hundred street children in Salvador...',
                autorUsuarioId: alunoConteudo.id,
                publicado: true,
            },
        ],
    });

    const simulado = await prisma.simulado.create({
        data: {
            livroId: livroPrincipal.id,
            titulo: 'Simulado ENEM - Capitães da Areia',
            descricao: 'Questões de literatura focadas na segunda geração do modernismo.',
            idioma: 'PT_BR',
            tempoLimiteMin: 30,
        },
    });

    await prisma.questao.createMany({
        data: [
            {
                simuladoId: simulado.id,
                enunciado:
                    'Em "Capitães da Areia", a trajetória de Pedro Bala reflete qual transformação ideológica?',
                alternativaA: 'Ele abandona os meninos para viver com uma família rica.',
                alternativaB: 'Ele se entrega à polícia para cumprir pena.',
                alternativaC: 'Ele transita de um líder marginalizado para um militante social.',
                alternativaD: 'Ele viaja pelo Brasil para se tornar um artista.',
                alternativaE: 'Ele se isola no interior da Bahia.',
                gabarito: 'C',
                dificuldade: 'MEDIA',
                comentarioResolucao:
                    'Pedro Bala assume uma consciência de classe ao final da obra.',
            },
            {
                simuladoId: simulado.id,
                enunciado: 'A personagem Dora tem a função narrativa principal de:',
                alternativaA: 'Trazer afeto e humanizar os meninos do trapiche.',
                alternativaB: 'Ensinar os meninos a ler e escrever.',
                alternativaC: 'Delatar o grupo para as autoridades locais.',
                alternativaD: 'Liderar assaltos sofisticados nas casas ricas.',
                alternativaE: 'Substituir o Padre José Pedro na educação religiosa.',
                gabarito: 'A',
                dificuldade: 'FACIL',
            },
            
            {
                simuladoId: simulado.id,
                enunciado:
                    'A obra "Capitães da Areia" insere-se na segunda fase do Modernismo brasileiro (fase regionalista). Qual é a principal denúncia social feita pelo autor no romance?',
                alternativaA: 'A escravidão nas fazendas de cacau no sul da Bahia.',
                alternativaB: 'O êxodo rural provocado pela seca no sertão nordestino.',
                alternativaC:
                    'O abandono, a marginalização e a violência contra menores em situação de rua em Salvador.',
                alternativaD: 'A exploração dos trabalhadores nas grandes indústrias paulistas.',
                alternativaE: 'A corrupção política durante a Era Vargas no Rio de Janeiro.',
                gabarito: 'C',
                dificuldade: 'FACIL',
                comentarioResolucao:
                    'Jorge Amado denuncia o descaso das autoridades e da sociedade com as crianças em situação de vulnerabilidade.',
            },
            {
                simuladoId: simulado.id,
                enunciado:
                    'O personagem Sem-Pernas possui uma estratégia peculiar que o diferencia no grupo para a realização de assaltos. Que tática é essa?',
                alternativaA:
                    'Ele finge ser um órfão dócil para se infiltrar na casa de famílias ricas e planejar os roubos de dentro.',
                alternativaB:
                    'Ele possui grande força física, sendo o único capaz de arrombar grandes cofres.',
                alternativaC:
                    'Ele se disfarça de entregador de mercadorias para assaltar armazéns no porto.',
                alternativaD:
                    'Ele atua como capoeirista para distrair a polícia na rua enquanto os outros roubam.',
                alternativaE: 'Ele suborna os guardas noturnos das grandes propriedades.',
                gabarito: 'A',
                dificuldade: 'MEDIA',
                comentarioResolucao:
                    'Sem-Pernas explorava sua deficiência física para despertar compaixão, sendo "adotado" temporariamente por famílias ricas apenas para mapear a casa para o bando.',
            },
            {
                simuladoId: simulado.id,
                enunciado:
                    'O Padre José Pedro, em sua relação com os Capitães da Areia, destaca-se por:',
                alternativaA: 'Tentar convertê-los ao protestantismo para salvá-los das ruas.',
                alternativaB:
                    'Explorar o trabalho infantil dos meninos em benefício das obras da paróquia.',
                alternativaC:
                    'Buscar compreendê-los e ajudá-los de forma genuína, muitas vezes enfrentando a reprovação da hierarquia da Igreja.',
                alternativaD:
                    'Ignorar a situação de miséria, focando apenas nos fiéis da elite baiana.',
                alternativaE: 'Ser o mandante oculto dos furtos realizados pelas crianças.',
                gabarito: 'C',
                dificuldade: 'MEDIA',
                comentarioResolucao:
                    'Padre José Pedro é a figura religiosa que tenta acolher os meninos com empatia, contrastando com a frieza institucional da Igreja na época.',
            },
            {
                simuladoId: simulado.id,
                enunciado:
                    'O personagem Volta Seca nutre uma profunda admiração por uma figura histórica, o que acaba definindo o seu destino no final da narrativa. Quem é essa figura e qual é o rumo tomado pelo menino?',
                alternativaA:
                    'Antônio Conselheiro; ele funda uma nova comunidade religiosa no interior.',
                alternativaB:
                    'Lampião; ele abandona Salvador e se junta a um bando de cangaceiros no sertão.',
                alternativaC: 'Getúlio Vargas; ele entra para a política sindicalista no porto.',
                alternativaD:
                    'Zumbi dos Palmares; ele lidera uma revolta popular contra a polícia local.',
                alternativaE:
                    'Luís Carlos Prestes; ele se alista na Coluna Prestes e viaja pelo país.',
                gabarito: 'B',
                dificuldade: 'MEDIA',
                comentarioResolucao:
                    'Volta Seca sonhava em ser cangaceiro e considerava Lampião seu herói. Ao final, realiza seu desejo indo para o cangaço.',
            },
            {
                simuladoId: simulado.id,
                enunciado:
                    'João José, conhecido como Professor, é o intelectual do grupo. Qual é o destino desse personagem no desfecho da obra?',
                alternativaA:
                    'Torna-se um grande advogado criminalista em Salvador para defender menores infratores.',
                alternativaB:
                    'Viaja para o Rio de Janeiro e se consagra como um pintor de sucesso, retratando a vida dos meninos de rua.',
                alternativaC:
                    'Morre tragicamente durante um violento confronto com a polícia no trapiche.',
                alternativaD:
                    'Assume a liderança dos Capitães da Areia após a saída de Pedro Bala.',
                alternativaE: 'É adotado por um juiz e passa a reprimir os antigos companheiros.',
                gabarito: 'B',
                dificuldade: 'DIFICIL',
                comentarioResolucao:
                    'O Professor canaliza seu talento artístico e vai para o Sul (Rio de Janeiro), usando a arte para dar visibilidade aos marginalizados.',
            },
        ],
    });

    console.log('✅ Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
