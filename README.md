# Padrão de Projeto: Proxy 🛡️

## 📋 Índice
- [O que é?](#o-que-é)
- [Problema](#problema)
- [Solução](#solução)
- [Tipos de Proxy](#tipos-de-proxy)
- [Implementação](#implementação)
- [Análise do Padrão](#análise-do-padrão)
- [Conclusão](#conclusão)

---

## O que é?

O **Proxy** é um padrão de projeto estrutural que fornece um substituto ou representante de outro objeto para controlar o acesso a ele.

**Analogia do mundo real:** 
Pense em um cartão de crédito como um proxy para sua conta bancária. Em vez de carregar dinheiro físico, você usa o cartão que representa e controla o acesso ao seu dinheiro real.

**Categoria:** Padrão Estrutural (GoF)

---

## Problema

Imagine que você tem um sistema de streaming que precisa carregar vídeos em alta qualidade. Carregar todos os vídeos imediatamente pode:

- ❌ Consumir muita memória
- ❌ Deixar o sistema lento
- ❌ Desperdiçar recursos se alguns vídeos nunca forem assistidos
- ❌ Aumentar o tempo de inicialização
- ❌ Desperdiçar banda de internet

**Exemplo prático:** Uma plataforma de cursos online com 50 videoaulas de 500MB cada. Carregar tudo de uma vez = 25GB de RAM e banda!

---

## Solução

O padrão Proxy cria um objeto "representante" que:
1. Tem a mesma interface do objeto real
2. Controla quando e como o objeto real é acessado
3. Pode adicionar lógica extra (cache, validação, log)

**Benefício:** O vídeo só é carregado quando realmente necessário (lazy loading)!

---

## Tipos de Proxy

### 1. 🎬 **Virtual Proxy**
Adia a criação de objetos caros até que sejam realmente necessários.
- **Exemplo:** Carregamento preguiçoso de vídeos em streaming

### 2. 🌐 **Remote Proxy**
Representa um objeto que está em outro espaço de endereçamento (servidor remoto).
- **Exemplo:** APIs REST, comunicação cliente-servidor

### 3. 🔒 **Protection Proxy**
Controla o acesso baseado em permissões.
- **Exemplo:** Sistema de autenticação e autorização

### 4. 🧠 **Smart Reference**
Adiciona funcionalidades extras ao acessar o objeto.
- **Exemplo:** Contagem de referências, cache, logging

---

## Implementação

### ❌ Sem o Padrão Proxy

**Problema:** Todos os vídeos são carregados imediatamente na memória.

```typescript
// sem-proxy/exemplo_sem_proxy.ts

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
```

**Saída:**
```
=== SISTEMA SEM PROXY ===

🔄 Baixando vídeo 'aula01_introducao.mp4' do servidor...
📦 Tamanho: 500MB
✅ Vídeo 'aula01_introducao.mp4' carregado na memória!

🔄 Baixando vídeo 'aula02_fundamentos.mp4' do servidor...
📦 Tamanho: 500MB
✅ Vídeo 'aula02_fundamentos.mp4' carregado na memória!

🔄 Baixando vídeo 'aula03_avancado.mp4' do servidor...
📦 Tamanho: 500MB
✅ Vídeo 'aula03_avancado.mp4' carregado na memória!

⏱️  Tempo total de inicialização: 9 segundos
📊 Memória consumida: ~1.5GB
🌐 Banda consumida: 1.5GB

--- Usuário reproduz apenas video1 ---
▶️  Reproduzindo vídeo: aula01_introducao.mp4

❌ Problema: Vídeos 2 e 3 foram baixados sem necessidade!
💸 Desperdício: 1GB de banda + 1GB de memória
```

---

### ✅ Com o Padrão Proxy

**Solução:** Vídeos só são carregados quando realmente necessários.

```typescript
// com-proxy/exemplo_com_proxy.ts

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
```

**Saída:**
```
=== SISTEMA COM PROXY ===

⏱️  Tempo de inicialização: < 0.1 segundos
📊 Memória consumida: ~0MB
🌐 Banda consumida: 0MB

--- Listando vídeos disponíveis ---
📹 aula01_introducao.mp4 (500MB) [Não carregado]
📹 aula02_fundamentos.mp4 (500MB) [Não carregado]
📹 aula03_avancado.mp4 (500MB) [Não carregado]

--- Usuário reproduz apenas video1 ---
⚡ Proxy: Iniciando carregamento sob demanda...
🔄 Baixando vídeo 'aula01_introducao.mp4' do servidor...
📦 Tamanho: 500MB
✅ Vídeo 'aula01_introducao.mp4' carregado na memória!
▶️  Reproduzindo vídeo: aula01_introducao.mp4

✅ Vantagem: Vídeos 2 e 3 NÃO foram baixados!
💰 Economia: 1GB de banda + 1GB de memória
⚡ Experiência: Sistema carregou instantaneamente
```

---

### 📊 Diagrama UML

```
┌─────────────────┐
│   <<interface>> │
│      Video      │
├─────────────────┤
│ + reproduzir()  │
│ + obter_info()  │
└─────────────────┘
         △
         │ implementa
    ┌────┴─────┐
    │          │
┌───┴────┐  ┌──┴──────┐
│VideoReal│  │ProxyVideo│
├─────────┤  ├─────────┤
│-arquivo │  │-arquivo │
│-tamanho_mb││-tamanho_mb│
│         │  │-video_real: VideoReal│
├─────────┤  ├─────────┤
│+reproduzir()││+reproduzir()│ ──────> usa
│+obter_info()││+obter_info()│
└─────────┘  └─────────┘
```

---

## Análise do Padrão

### ✅ Pontos Fortes

| Vantagem | Descrição |
|----------|-----------|
| **Lazy Loading** | Objetos caros só são criados quando necessários |
| **Controle de Acesso** | Pode adicionar validações e permissões |
| **Desempenho** | Reduz consumo de memória e tempo de inicialização |
| **Logging/Auditoria** | Fácil adicionar registro de acessos |
| **Cache** | Pode armazenar resultados para reutilização |
| **Open/Closed Principle** | Adiciona funcionalidades sem modificar o objeto real |

### ❌ Pontos Fracos

| Desvantagem | Descrição |
|-------------|-----------|
| **Complexidade** | Adiciona mais classes ao sistema |
| **Latência Inicial** | Primeiro acesso pode ser lento (lazy loading) |
| **Código Extra** | Precisa manter proxy e objeto real sincronizados |
| **Confusão** | Pode ser confundido com Decorator ou Adapter |

---

## 🎯 Quando Usar?

### ✅ Use Proxy quando:
- Objetos são caros para criar/carregar
- Precisa controlar acesso a um objeto
- Quer adicionar funcionalidades transparentes (log, cache)
- Trabalha com objetos remotos

### ❌ Evite Proxy quando:
- O objeto é leve e rápido de criar
- Não há necessidade de controle de acesso
- A complexidade adicional não vale a pena

---

## 🆚 Diferenças de Outros Padrões

### Proxy vs Decorator
- **Proxy:** Controla acesso ao objeto (foco: gerenciamento)
- **Decorator:** Adiciona responsabilidades (foco: funcionalidades)

### Proxy vs Adapter
- **Proxy:** Mesma interface do objeto real
- **Adapter:** Interface diferente (adaptação)

### Proxy vs Facade
- **Proxy:** Substitui UM objeto
- **Facade:** Simplifica subsistema inteiro

---

## 📚 Exemplos Reais

1. **Hibernate/ORM:** Lazy loading de entidades do banco
2. **APIs REST:** Cliente HTTP como proxy para servidor remoto
3. **Netflix/YouTube:** Carregamento sob demanda de vídeos em streaming
4. **Nginx/Apache:** Reverse proxy para servidores

---

## Conclusão

O padrão Proxy resolve um problema simples mas muito comum: evitar o desperdício de recursos. Em vez de carregar tudo antecipadamente, o proxy funciona como um intermediário inteligente que só busca o recurso real quando ele é realmente necessário.

No exemplo dos vídeos, vimos claramente a diferença: sem o proxy, o sistema carrega todos os vídeos na inicialização (gastando tempo, memória e banda), mesmo que o usuário assista apenas um. Com o proxy, cada vídeo só é carregado no momento em que o usuário clica para reproduzi-lo.

Essa abordagem traz benefícios práticos:
- O sistema inicia mais rápido
- Consome menos memória
- Economiza banda de internet
- Melhora a experiência do usuário

O proxy é amplamente utilizado em aplicações reais como plataformas de streaming (Netflix, YouTube), sistemas de e-learning, ORMs (Hibernate), e frameworks web (Spring). Sempre que você vê um "carregando..." ao clicar em um vídeo ou imagem, provavelmente há um proxy trabalhando nos bastidores.

A implementação é direta: criamos uma classe proxy que tem a mesma interface do objeto real, mas mantém uma referência que só é inicializada quando necessário. O cliente não percebe a diferença, mas ganha todos os benefícios de desempenho.

Em resumo, o padrão Proxy é sobre **eficiência e controle**: carregar apenas o necessário, no momento certo, sem complicar o código do cliente.

---

**Autor:** [Seu Nome]  
**Disciplina:** Engenharia de Software II  
**Data:** Novembro 2024  
**Referência:** Design Patterns: Elements of Reusable Object-Oriented Software (GoF)