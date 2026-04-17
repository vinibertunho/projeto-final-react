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
            capaUrl: 'https://example.com/capitaes.jpg',
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
