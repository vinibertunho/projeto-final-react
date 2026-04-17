import prisma from '../lib/services/prismaClient.js';

export default class LivroModel {
    constructor({
        id = null,
        titulo,
        autor,
        anoPublicacao = null,
        sinopse = null,
        capaUrl = null,
        equipeId = null,
        isLivroPrincipal = false,
    } = {}) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.sinopse = sinopse;
        this.capaUrl = capaUrl;
        this.equipeId = equipeId;
        this.isLivroPrincipal = isLivroPrincipal;
    }

    async criar() {
        return prisma.livro.create({
            data: {
                titulo: this.titulo,
                autor: this.autor,
                anoPublicacao: this.anoPublicacao,
                sinopse: this.sinopse,
                capaUrl: this.capaUrl,
                equipeId: this.equipeId,
                isLivroPrincipal: this.isLivroPrincipal,
            },
        });
    }

    async atualizar() {
        return prisma.livro.update({
            where: { id: this.id },
            data: {
                titulo: this.titulo,
                autor: this.autor,
                anoPublicacao: this.anoPublicacao,
                sinopse: this.sinopse,
                capaUrl: this.capaUrl,
                equipeId: this.equipeId,
                isLivroPrincipal: this.isLivroPrincipal,
            },
        });
    }

    async deletar() {
        return prisma.livro.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.titulo) {
            where.titulo = { contains: filtros.titulo, mode: 'insensitive' };
        }
        if (filtros.autor) {
            where.autor = { contains: filtros.autor, mode: 'insensitive' };
        }
        if (filtros.isLivroPrincipal !== undefined) {
            where.isLivroPrincipal =
                filtros.isLivroPrincipal === 'true' || filtros.isLivroPrincipal === true;
        }
        if (filtros.anoPublicacao) {
            where.anoPublicacao = parseInt(filtros.anoPublicacao, 10);
        }
        if (filtros.equipeId) {
            where.equipeId = filtros.equipeId;
        }

        return prisma.livro.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.livro.findUnique({ where: { id } });
        if (!data) {
            return null;
        }
        return new LivroModel(data);
    }
}
