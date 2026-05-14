export class OneEuroFilter {
    /**
     * @param {number} mincutoff - Frequência de corte mínima (Hz). Controla o tremor (jitter). Valores menores = menos tremor, mas mais lag.
     * @param {number} beta - Fator de velocidade. Controla o lag. Valores maiores = menos lag em alta velocidade.
     * @param {number} dcutoff - Frequência de corte para a derivada (velocidade). Geralmente mantido em 1.0.
     */
    constructor(mincutoff = 1.0, beta = 0.007, dcutoff = 1.0) {
        this.mincutoff = mincutoff;
        this.beta = beta;
        this.dcutoff = dcutoff;
        
        this.x_prev = null;
        this.dx_prev = 0;
        this.t_prev = null;
    }

    // Calcula o alpha baseado na frequência de corte e tempo
    alpha(cutoff, te) {
        const tau = 1.0 / (2 * Math.PI * cutoff);
        return 1.0 / (1.0 + tau / te);
    }

    filter(x, t) {
        // Primeiro frame: não há como filtrar, apenas guarda os valores
        if (this.x_prev === null) {
            this.x_prev = x;
            this.t_prev = t;
            return x;
        }

        // Calcula o delta time (tempo decorrido entre frames) em segundos
        const te = (t - this.t_prev) / 1000.0; 
        
        // Evita divisão por zero se os frames chegarem instantaneamente
        if (te <= 0) return x; 

        // 1. Calcula a velocidade (derivada dx)
        let dx = (x - this.x_prev) / te;
        
        // 2. Filtra a própria velocidade para evitar picos bizarros
        const alpha_d = this.alpha(this.dcutoff, te);
        const edx = alpha_d * dx + (1.0 - alpha_d) * this.dx_prev;
        this.dx_prev = edx;

        // 3. Calcula a frequência de corte dinâmica (A mágica acontece aqui)
        const cutoff = this.mincutoff + this.beta * Math.abs(edx);

        // 4. Calcula o fator de suavização final e aplica na posição
        const alpha = this.alpha(cutoff, te);
        const x_hat = alpha * x + (1.0 - alpha) * this.x_prev;

        // Guarda os valores para o próximo frame
        this.x_prev = x_hat;
        this.t_prev = t;

        return x_hat;
    }
}
