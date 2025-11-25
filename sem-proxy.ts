class VideoReal {
    private arquivo: string;
    private tamanhoMb: number = 500; // Vídeo de 500MB

    constructor(arquivo: string) {
        this.arquivo = arquivo;
        this.carregarDoServidor(); // Carrega IMEDIATAMENTE
    }

    private carregarDoServidor(): void {
        console.log(`🔄 Baixando vídeo '${this.arquivo}' do servidor...`);
        console.log(`📦 Tamanho: ${this.tamanhoMb}MB`);
        
        // Simula operação custosa (download)
        this.sleep(3000); // 3 segundos para baixar
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

// Uso do sistema
console.log("=== SISTEMA SEM PROXY ===\n");

// Problema: Todos carregam na criação
const video1 = new VideoReal("aula01_introducao.mp4");  // Carrega agora (3s)
console.log();
const video2 = new VideoReal("aula02_fundamentos.mp4"); // Carrega agora (3s)
console.log();
const video3 = new VideoReal("aula03_avancado.mp4");    // Carrega agora (3s)

console.log("\n⏱️  Tempo total de inicialização: 9 segundos");
console.log("📊 Memória consumida: ~1.5GB");
console.log("🌐 Banda consumida: 1.5GB");

// Usuário só quer assistir o primeiro vídeo
console.log("\n--- Usuário reproduz apenas video1 ---");
video1.reproduzir();

console.log("\n❌ Problema: Vídeos 2 e 3 foram baixados sem necessidade!");
console.log("💸 Desperdício: 1GB de banda + 1GB de memória");