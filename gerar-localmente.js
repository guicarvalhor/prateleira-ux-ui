const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const initialLinks = [
     { name: "Mobbin", url: "https://mobbin.com/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Lookup", url: "https://lookup.design/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Interface Index", url: "https://interface-index.com/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Godly", url: "https://godly.website/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Design Vault", url: "https://designvault.io/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Page Flows", url: "https://pageflows.com/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Awwwards", url: "https://www.awwwards.com/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Viewport", url: "https://viewport-ui.design/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Unsection", url: "https://www.unsection.com/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Collect UI", url: "https://collectui.com/designs", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Web Interactions Gallery", url: "https://www.webinteractions.gallery/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Supahero", url: "https://www.supahero.io/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Navbar Gallery", url: "https://www.navbar.gallery/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Design Munk", url: "https://designmunk.com/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Footer Design", url: "https://www.footer.design/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "A/B Test Design", url: "https://abtest.design/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Paywall Library by Adapty", url: "https://adapty.io/paywall-library/", category: "Inspiração (UI Geral & Componentes)" },
        { name: "Flowjam", url: "https://www.flowjam.com/library", category: "Inspiração (UI Geral & Componentes)" },

        // Categoria: Inspiração (Landing Pages)
        { name: "Landing Folio", url: "https://landingfolio.com/", category: "Inspiração (Landing Pages)" },
        { name: "Lapa Ninja", url: "https://www.lapa.ninja/", category: "Inspiração (Landing Pages)" },
        { name: "Landing Love", url: "https://www.landing.love/", category: "Inspiração (Landing Pages)" },
        { name: "One Page Love", url: "https://onepagelove.com/", category: "Inspiração (Landing Pages)" },

        // Categoria: Inspiração (Portfólios)
        { name: "Pafolios", url: "https://pafolios.com/", category: "Inspiração (Portfólios)" },
        { name: "Deck Gallery", url: "https://www.deck.gallery/", category: "Inspiração (Portfólios)" },
        { name: "Scrnshts", url: "https://scrnshts.club/", category: "Inspiração (Portfólios)" },

        // Categoria: Padrões de UI & Design Systems
        { name: "UX Archive", url: "https://uxarchive.com/", category: "Padrões de UI & Design Systems" },
        { name: "Brand Guidelines", url: "https://www.brandguidelines.net/", category: "Padrões de UI & Design Systems" },
        { name: "Design Systems Repo", url: "https://designsystemsrepo.com/design-systems", category: "Padrões de UI & Design Systems" },
        { name: "Design Systems Brasileiros", url: "https://designsystemsbrasileiros.com/", category: "Padrões de UI & Design Systems" },
        { name: "UI-Patterns.com", url: "https://ui-patterns.com/patterns", category: "Padrões de UI & Design Systems" },
        { name: "UI Garage", url: "https://uigarage.net/", category: "Padrões de UI & Design Systems" },
        { name: "UI Patterns.io", url: "http://uipatterns.io/", category: "Padrões de UI & Design Systems" },
        { name: "GoodUI Patterns", url: "https://goodui.org/patterns/", category: "Padrões de UI & Design Systems" },
        { name: "Dark Patterns", url: "https://www.darkpatterns.org/", category: "Padrões de UI & Design Systems" },
        { name: "Adele by UXPin", url: "https://adele.uxpin.com/", category: "Padrões de UI & Design Systems" },

        // Categoria: Recursos (Ilustrações & Ícones)
        { name: "DrawKit", url: "https://www.drawkit.com/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "Blush (Humaaans)", url: "https://blush.design/collections/humaaans/humaaans", category: "Recursos (Ilustrações & Ícones)" },
        { name: "Scale Illustrations", url: "https://scale.flexiple.com/illustrations/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "Sketchvalley", url: "https://sketchvalley.com/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "SVG Repo", url: "https://www.svgrrepo.com/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "Cool Shapes", url: "https://coolshap.es/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "SVG Hub", url: "https://svghub.vercel.app/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "Flaticon", url: "https://www.flaticon.com/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "Basicons", url: "https://basicons.xyz/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "Atlas Icons", url: "https://atlasicons.vectopus.com/", category: "Recursos (Ilustrações & Ícones)" },
        { name: "MingCute Icons", url: "https://www.mingcute.com/", category: "Recursos (Ilustrações & Ícones)" },

        // Categoria: Recursos (Mockups & Imagens)
        { name: "Artboard Studio", url: "https://artboard.studio/", category: "Recursos (Mockups & Imagens)" },
        { name: "Mockup Hunt", url: "https://mockuphunt.co/", category: "Recursos (Mockups & Imagens)" },
        { name: "Mockup World", url: "https://www.mockupworld.co/", category: "Recursos (Mockups & Imagens)" },
        { name: "Mr. Mockup", url: "https://mrmockup.com/free-mockups/", category: "Recursos (Mockups & Imagens)" },
        { name: "Creatoom", url: "https://creatoom.com/", category: "Recursos (Mockups & Imagens)" },
        { name: "Content Core", url: "https://contentcore.xyz/", category: "Recursos (Mockups & Imagens)" },
        { name: "Shots.so", url: "https://shots.so/", category: "Recursos (Mockups & Imagens)" },
        { name: "Mockuuups Studio", url: "https://pt-br.mockuuups.studio/", category: "Recursos (Mockups & Imagens)" },
        { name: "Mockups Design", url: "https://mockups-design.com/", category: "Recursos (Mockups & Imagens)" },
        { name: "Resource Boy", url: "https://resourceboy.com/", category: "Recursos (Mockups & Imagens)" },
        { name: "Pexels", url: "https://www.pexels.com/pt-br/", category: "Recursos (Mockups & Imagens)" },
        
        // Categoria: Recursos (Cores & Gráficos)
        { name: "Mesh Gradients", url: "https://products.ls.graphics/mesh-gradients/", category: "Recursos (Cores & Gráficos)" },
        { name: "CSS Gradient", url: "https://cssgradient.io/", category: "Recursos (Cores & Gráficos)" },
        { name: "Pigment", url: "https://pigment.shapefactory.co/", category: "Recursos (Cores & Gráficos)" },
        { name: "Coolors", url: "https://coolors.co/", category: "Recursos (Cores & Gráficos)" },
        { name: "WebGradients", url: "https://webgradients.com/", category: "Recursos (Cores & Gráficos)" },
        { name: "Happy Hues", url: "https://www.happyhues.co/", category: "Recursos (Cores & Gráficos)" },
        { name: "Realtime Colors", url: "https://www.realtimecolors.com/", category: "Recursos (Cores & Gráficos)" },
        { name: "Good Palette", url: "https://goodpalette.io/33de8e-7915d1-bbc4c0", category: "Recursos (Cores & Gráficos)" },
        { name: "Material Theme Builder", url: "https://material-foundation.github.io/material-theme-builder/", category: "Recursos (Cores & Gráficos)" },
        { name: "Picular", url: "https://picular.co/", category: "Recursos (Cores & Gráficos)" },
        { name: "404s Design", url: "https://www.404s.design/", category: "Recursos (Cores & Gráficos)" },
        { name: "Haikei", url: "https://app.haikei.app/", category: "Recursos (Cores & Gráficos)" },

        // Categoria: Recursos (Fontes)
        { name: "Google Fonts", url: "https://fonts.google.com/", category: "Recursos (Fontes)" },
        { name: "Fontpair", url: "https://www.fontpair.co/", category: "Recursos (Fontes)" },
        { name: "Typescale.com", url: "https://typescale.com/", category: "Recursos (Fontes)" },
        { name: "All Free Fonts", url: "https://www.allfreefonts.co/", category: "Recursos (Fontes)" },
        { name: "Typewolf", url: "https://www.typewolf.com/", category: "Recursos (Fontes)" },
        { name: "Befonts", url: "https://befonts.com/", category: "Recursos (Fontes)" },
        { name: "Fontshare", url: "https://fontshare.com/", category: "Recursos (Fontes)" },
        { name: "Uncut", url: "https://uncut.wtf/", category: "Recursos (Fontes)" },
        { name: "Dirtyline Studio", url: "https://dirtylinestudio.com/", category: "Recursos (Fontes)" },
        
        // Categoria: Ferramentas
        { name: "UI Generator", url: "https://uigenerator.org/", category: "Ferramentas" },
        { name: "Figma Components", url: "https://www.figcomponents.com/components", category: "Ferramentas" },
        { name: "BrandBird", url: "https://www.brandbird.app/", category: "Ferramentas" },
        { name: "Dub.co", url: "https://dub.co/home", category: "Ferramentas" },
        { name: "Tally", url: "https://tally.so/", category: "Ferramentas" },
        { name: "Product Hunt", url: "https://www.producthunt.com/", category: "Ferramentas" },
        { name: "Buildship", url: "https://buildship.com/", category: "Ferramentas" },
        { name: "Mentimeter", url: "https://www.mentimeter.com/pt-BR", category: "Ferramentas" },
        
        // Categoria: Ferramentas (IA)
        { name: "Krea", url: "https://www.krea.ai/", category: "Ferramentas (IA)" },
        { name: "Claid", url: "https://claid.ai/", category: "Ferramentas (IA)" },
        { name: "Lummi", url: "https://www.lummi.ai/", category: "Ferramentas (IA)" },
        { name: "Perplexity", url: "https://www.perplexity.ai/", category: "Ferramentas (IA)" },
        { name: "Writesonic", url: "https://writesonic.com/", category: "Ferramentas (IA)" },
        { name: "Recraft", url: "https://www.recraft.ai/", category: "Ferramentas (IA)" },

        // Categoria: Ferramentas (Figma Plugins)
        { name: "Typescales Plugin", url: "https://www.figma.com/community/plugin/739825414752646970/typescales", category: "Ferramentas (Figma Plugins)" },
        { name: "DesignDoc", url: "https://www.figma.com/community/plugin/1177722582033208360/designdoc-spectral-measures-annotations-and-handoff", category: "Ferramentas (Figma Plugins)" },
        { name: "Supa Palette", url: "https://www.figma.com/community/plugin/1103648664059257410/supa-palette", category: "Ferramentas (Figma Plugins)" },
        { name: "SVG Repo Plugin", url: "https://www.figma.com/community/plugin/1200930158268112554/svg-repo-free-icons-and-vectors", category: "Ferramentas (Figma Plugins)" },
        { name: "Iconify", url: "https://www.figma.com/community/plugin/735098390272716381/iconify", category: "Ferramentas (Figma Plugins)" },
        { name: "Animate It", url: "https://www.figma.com/community/plugin/1470719638106565683/animate-it", category: "Ferramentas (Figma Plugins)" },
        { name: "Unsplash Plugin", url: "https://www.figma.com/community/plugin/738454987945972471/unsplash", category: "Ferramentas (Figma Plugins)" },
        { name: "Vector Map Maker", url: "https://www.figma.com/community/plugin/1251030017228239072/vector-map-maker", category: "Ferramentas (Figma Plugins)" },
        { name: "Storyset by Freepik", url: "https://www.figma.com/community/plugin/865232148477039928/storyset-by-freepik", category: "Ferramentas (Figma Plugins)" },
        { name: "User Profile Avatar", url: "https://www.figma.com/community/plugin/749945157855564842/user-profile-avatar", category: "Ferramentas (Figma Plugins)" },
        { name: "iOS 16 UI Kit", url: "https://www.figma.com/community/file/1121065701252736567/ios-16-ui-kit-for-figma", category: "Ferramentas (Figma Plugins)" },

        // Categoria: Aprendizado (Artigos & Desafios)
        { name: "NNGroup Blog", url: "https://www.nngroup.com/articles/", category: "Aprendizado (Artigos & Desafios)" },
        { name: "UX Library", url: "https://www.uxlibrary.org/", category: "Aprendizado (Artigos & Desafios)" },
        { name: "UX Checklist", url: "http://uxchecklist.github.io/", category: "Aprendizado (Artigos & Desafios)" },
        { name: "Drawerrr Challenge", url: "https://drawerrr.com/challenge#target-problem", category: "Aprendizado (Artigos & Desafios)" },
        { name: "FakeClients", url: "https://fakeclients.com/ux", category: "Aprendizado (Artigos & Desafios)" },

        // Categoria: Aprendizado (Cursos)
        { name: "Intuitive Pixel", url: "https://www.intuitivepixel.com.br/", category: "Aprendizado (Cursos)" },
        { name: "Design Circuit School", url: "https://designcircuit.co/lc/dcschool/", category: "Aprendizado (Cursos)" },
        { name: "EBAC", url: "https://ebaconline.com.br/uxui-designer#price", category: "Aprendizado (Cursos)" },
        { name: "UX Unicórnio", url: "https://uxunicornio.com.br/", category: "Aprendizado (Cursos)" },
        { name: "Udemy UX Design", url: "https://www.udemy.com/courses/search/?src=ukw&q=ux+design", category: "Aprendizado (Cursos)" },
        { name: "ESPM UX Design", url: "https://uxdi.espm.br/ux-design-b/?gad_source=1#price", category: "Aprendizado (Cursos)" },
        
];

const outputDir = path.join(__dirname, 'assets', 'screenshots');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function urlToFilename(url) {
    return url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpeg';
}

async function generateLocalScreenshots() {
    console.log('Iniciando o navegador...');
    
    // ================== INÍCIO DA MUDANÇA ==================
    const browser = await puppeteer.launch({
        headless: "new", // Usa o novo modo Headless que é mais moderno
        ignoreHTTPSErrors: true // A MUDANÇA PRINCIPAL: Ignora erros de SSL
    });
    // =================== FIM DA MUDANÇA ===================
    
    const page = await browser.newPage();
    
    // Ajuste adicional: Define um User Agent de um navegador comum
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    await page.setViewport({ width: 1280, height: 800 });

    console.log('Iniciando a geração de screenshots...');
    for (const link of initialLinks) {
        const filename = urlToFilename(link.url);
        const outputPath = path.join(outputDir, filename);

        if (fs.existsSync(outputPath)) {
            console.log(`- [JÁ EXISTE] ${link.name}`);
            continue;
        }

        console.log(`- [PROCESSANDO] ${link.name}...`);
        try {
            // Aumentamos um pouco o timeout para dar mais chance para sites lentos
            await page.goto(link.url, { waitUntil: 'networkidle2', timeout: 45000 }); 
            await page.screenshot({ path: outputPath, type: 'jpeg', quality: 80 });
            console.log(`  - [SALVO] ${filename}`);
        } catch (error) {
            console.error(`  - [ERRO] Falha ao processar ${link.name}: ${error.message}`);
        }
    }

    await browser.close();
    console.log('\nGeração de screenshots concluída!');
}

generateLocalScreenshots();