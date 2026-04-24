import prisma from '../lib/services/prismaClient.js';

export default class SimuladoModel {
    constructor({
        id = null,
        livroId = null,
        titulo,
        idioma = 'PT_BR',
        tempoLimiteMin = null,
        ativo = true,
    } = {}) {
        this.id = id;
        this.livroId = livroId;
        this.titulo = titulo;
        this.idioma = idioma;
        this.tempoLimiteMin = tempoLimiteMin;
        this.ativo = ativo;
    }

    async salvar() {
        const dados = {
            livroId: this.livroId ? Number(this.livroId) : null,
            titulo: this.titulo,
            idioma: this.idioma,
            tempoLimiteMin: this.tempoLimiteMin ? Number(this.tempoLimiteMin) : null,
            ativo: String(this.ativo) === 'true',
        };

        if (this.id) {
            return prisma.simulado.update({ where: { id: this.id }, data: dados });
        }

        return prisma.simulado.create({ data: dados });
    }

    static async buscarComQuestoes(id) {
        return prisma.simulado.findUnique({
            where: { id: Number(id) },
            include: {
                questoes: true,
            },
        });
    }
}
