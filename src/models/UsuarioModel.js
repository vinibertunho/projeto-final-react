import prisma from '../lib/services/prismaClient.js';

export default class UsuarioModel {
    constructor({
        id = null,
        nome,
        email,
        senhaHash,
        papel = 'LEITOR',
        idiomaPreferido = 'PT_BR',
        ativo = true,
    } = {}) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.papel = papel;
        this.idiomaPreferido = idiomaPreferido;
        this.ativo = ativo;
    }

    async salvar() {
        const dados = {
            nome: this.nome,
            email: this.email,
            senhaHash: this.senhaHash,
            papel: this.papel,
            idiomaPreferido: this.idiomaPreferido,
            ativo: this.ativo,
        };

        if (this.id) {
            return prisma.usuario.update({ where: { id: this.id }, data: dados });
        }

        const novo = await prisma.usuario.create({ data: dados });
        this.id = novo.id;
        return novo;
    }

    static async buscarTodos(filtros = {}) {
        const where = {};
        if (filtros.nome) where.nome = { contains: filtros.nome, mode: 'insensitive' };
        if (filtros.email) where.email = { contains: filtros.email, mode: 'insensitive' };
        if (filtros.ativo !== undefined) where.ativo = String(filtros.ativo) === 'true';

        return prisma.usuario.findMany({ where });
    }

    static async buscarPorId(id) {
        const data = await prisma.usuario.findUnique({ where: { id: Number(id) } });
        return data ? new UsuarioModel(data) : null;
    }
}
