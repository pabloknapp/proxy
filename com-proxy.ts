// Interface comum
interface Video {
    reproduzir(): void;
    obterInfo(): string;
}

// Objeto Real (pesado)
class VideoReal implements Video {
    private arquivo: string;
    private tamanhoMb: number = 500;

    constructor(arquivo: string) {
        this.arquivo = arquivo;
        this.carregarDoServidor();
    }

    private carregarDoServidor(): void {
        console.log(`🔄 Baixando vídeo '${this.arquivo}' do servidor...`);
        console.log(`📦 Tamanho: ${this.tamanhoMb}MB`);
        
        this.sleep(3000);
        console.log(`✅ Vídeo '${this.arquivo}' carregado na memória!`);
    }

    public reproduzir(): void {
        console.log(`▶️  Reproduzindo vídeo: ${this.arquivo}`);
    }

    public obterInfo(): string {
        return `📹 ${this.arquivo} (${this.tamanhoMb}MB)`;
    }

    private sleep(ms: number): void {
        const start = Date.now();
        while (Date.now() - start < ms) {}
    }
}

// Proxy (representante leve)
class ProxyVideo implements Video {
    private arquivo: string;
    private tamanhoMb: number = 500;
    private videoReal: VideoReal | null = null; // Não carrega ainda!

    constructor(arquivo: string) {
        this.arquivo = arquivo;
    }

    public reproduzir(): void {
        // Só carrega quando necessário (lazy loading)
        if (this.videoReal === null) {
            console.log(`⚡ Proxy: Iniciando carregamento sob demanda...`);
            this.videoReal = new VideoReal(this.arquivo);
        }

        this.videoReal.reproduzir();
    }

    public obterInfo(): string {
        // Pode fornecer info sem carregar o vídeo
        return `📹 ${this.arquivo} (${this.tamanhoMb}MB) [Não carregado]`;
    }
}

// Uso do sistema
console.log("=== SISTEMA COM PROXY ===\n");

// Criação instantânea (não carrega)
const video1 = new ProxyVideo("aula01_introducao.mp4");  // Instantâneo!
const video2 = new ProxyVideo("aula02_fundamentos.mp4"); // Instantâneo!
const video3 = new ProxyVideo("aula03_avancado.mp4");    // Instantâneo!

console.log("⏱️  Tempo de inicialização: < 0.1 segundos");
console.log("📊 Memória consumida: ~0MB");
console.log("🌐 Banda consumida: 0MB\n");

// Pode obter informações sem carregar
console.log("--- Listando vídeos disponíveis ---");
console.log(video1.obterInfo());
console.log(video2.obterInfo());
console.log(video3.obterInfo());

// Usuário só quer assistir o primeiro vídeo
console.log("\n--- Usuário reproduz apenas video1 ---");
video1.reproduzir(); // SÓ AGORA baixa aula01_introducao.mp4

console.log("\n✅ Vantagem: Vídeos 2 e 3 NÃO foram baixados!");
console.log("💰 Economia: 1GB de banda + 1GB de memória");
console.log("⚡ Experiência: Sistema carregou instantaneamente");