#!/usr/bin/env node

/**
 * Script de Teste Automatizado de Acessibilidade
 * 
 * Este script executa testes automatizados de acessibilidade usando axe-core
 * em todas as páginas principais da plataforma Arquimedes.
 * 
 * Uso:
 *   node scripts/test-accessibility.mjs
 * 
 * Pré-requisitos:
 *   - Servidor de desenvolvimento rodando em http://localhost:3000
 *   - Pacotes: puppeteer, axe-core
 * 
 * Instalação:
 *   pnpm add -D puppeteer axe-core
 */

import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar axe-core do node_modules
const axeSource = readFileSync(
  join(__dirname, '../node_modules/axe-core/axe.min.js'),
  'utf8'
);

// Páginas a serem testadas
const PAGES_TO_TEST = [
  { name: 'Login', url: 'http://localhost:3000/' },
  { name: 'Dashboard', url: 'http://localhost:3000/dashboard' },
  { name: 'Perfil', url: 'http://localhost:3000/perfil' },
  { name: 'Desafio do Dia', url: 'http://localhost:3000/desafio-do-dia' },
  { name: 'Sala de Exercícios', url: 'http://localhost:3000/exercicios' },
  { name: 'Sala de Vídeos', url: 'http://localhost:3000/videos' },
  { name: 'Minhas Disciplinas', url: 'http://localhost:3000/disciplinas' },
];

// Níveis de severidade com cores
const SEVERITY_COLORS = {
  critical: '\x1b[41m\x1b[37m', // Fundo vermelho, texto branco
  serious: '\x1b[31m',           // Texto vermelho
  moderate: '\x1b[33m',          // Texto amarelo
  minor: '\x1b[36m',             // Texto ciano
  reset: '\x1b[0m',              // Reset
};

/**
 * Executa análise de acessibilidade em uma página
 */
async function testPage(page, pageInfo) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 Testando: ${pageInfo.name}`);
  console.log(`🔗 URL: ${pageInfo.url}`);
  console.log(`${'='.repeat(80)}\n`);

  try {
    // Navegar para a página
    await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Aguardar um pouco para garantir que conteúdo dinâmico carregou
    await page.waitForTimeout(2000);

    // Injetar axe-core
    await page.evaluate(axeSource);

    // Executar análise de acessibilidade
    const results = await page.evaluate(async () => {
      return await axe.run();
    });

    // Processar resultados
    const { violations, passes, incomplete } = results;

    // Estatísticas
    console.log(`✅ Testes Passados: ${passes.length}`);
    console.log(`❌ Violações Encontradas: ${violations.length}`);
    console.log(`⚠️  Testes Incompletos: ${incomplete.length}\n`);

    // Agrupar violações por severidade
    const violationsBySeverity = {
      critical: [],
      serious: [],
      moderate: [],
      minor: [],
    };

    violations.forEach((violation) => {
      violationsBySeverity[violation.impact].push(violation);
    });

    // Exibir violações por severidade
    let totalIssues = 0;
    
    ['critical', 'serious', 'moderate', 'minor'].forEach((severity) => {
      const items = violationsBySeverity[severity];
      if (items.length > 0) {
        const color = SEVERITY_COLORS[severity];
        const reset = SEVERITY_COLORS.reset;
        
        console.log(`${color}${severity.toUpperCase()} (${items.length})${reset}`);
        
        items.forEach((violation, index) => {
          totalIssues += violation.nodes.length;
          
          console.log(`\n  ${index + 1}. ${violation.help}`);
          console.log(`     ID: ${violation.id}`);
          console.log(`     Impacto: ${violation.impact}`);
          console.log(`     Elementos afetados: ${violation.nodes.length}`);
          console.log(`     Descrição: ${violation.description}`);
          console.log(`     Saiba mais: ${violation.helpUrl}`);
          
          // Mostrar até 3 exemplos de elementos afetados
          const nodesToShow = Math.min(3, violation.nodes.length);
          console.log(`     Exemplos de elementos:`);
          
          for (let i = 0; i < nodesToShow; i++) {
            const node = violation.nodes[i];
            console.log(`       - ${node.html.substring(0, 100)}${node.html.length > 100 ? '...' : ''}`);
            console.log(`         Target: ${node.target.join(' ')}`);
            
            if (node.failureSummary) {
              console.log(`         Problema: ${node.failureSummary.split('\n')[0]}`);
            }
          }
          
          if (violation.nodes.length > nodesToShow) {
            console.log(`       ... e mais ${violation.nodes.length - nodesToShow} elementos`);
          }
        });
        
        console.log('');
      }
    });

    // Exibir testes incompletos (requerem revisão manual)
    if (incomplete.length > 0) {
      console.log(`\n⚠️  TESTES INCOMPLETOS (Requerem Revisão Manual):\n`);
      
      incomplete.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.help}`);
        console.log(`     ID: ${item.id}`);
        console.log(`     Elementos: ${item.nodes.length}`);
        console.log(`     Descrição: ${item.description}`);
        console.log('');
      });
    }

    // Resumo final da página
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`📊 RESUMO - ${pageInfo.name}:`);
    console.log(`   ✅ Testes Passados: ${passes.length}`);
    console.log(`   ❌ Total de Problemas: ${totalIssues}`);
    console.log(`   🔴 Críticos: ${violationsBySeverity.critical.reduce((sum, v) => sum + v.nodes.length, 0)}`);
    console.log(`   🟠 Sérios: ${violationsBySeverity.serious.reduce((sum, v) => sum + v.nodes.length, 0)}`);
    console.log(`   🟡 Moderados: ${violationsBySeverity.moderate.reduce((sum, v) => sum + v.nodes.length, 0)}`);
    console.log(`   🔵 Menores: ${violationsBySeverity.minor.reduce((sum, v) => sum + v.nodes.length, 0)}`);
    console.log(`   ⚠️  Incompletos: ${incomplete.length}`);
    console.log(`${'─'.repeat(80)}\n`);

    return {
      page: pageInfo.name,
      url: pageInfo.url,
      passes: passes.length,
      violations: violations.length,
      totalIssues,
      critical: violationsBySeverity.critical.reduce((sum, v) => sum + v.nodes.length, 0),
      serious: violationsBySeverity.serious.reduce((sum, v) => sum + v.nodes.length, 0),
      moderate: violationsBySeverity.moderate.reduce((sum, v) => sum + v.nodes.length, 0),
      minor: violationsBySeverity.minor.reduce((sum, v) => sum + v.nodes.length, 0),
      incomplete: incomplete.length,
    };

  } catch (error) {
    console.error(`❌ Erro ao testar ${pageInfo.name}:`, error.message);
    return {
      page: pageInfo.name,
      url: pageInfo.url,
      error: error.message,
    };
  }
}

/**
 * Executa testes em todas as páginas
 */
async function runTests() {
  console.log('\n🚀 Iniciando Testes de Acessibilidade - Arquimedes\n');
  console.log('📋 Páginas a testar:', PAGES_TO_TEST.length);
  console.log('🔧 Ferramenta: axe-core');
  console.log('📏 Padrão: WCAG 2.1 Level AA\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  
  // Configurar viewport
  await page.setViewport({ width: 1920, height: 1080 });

  const results = [];

  // Testar cada página
  for (const pageInfo of PAGES_TO_TEST) {
    const result = await testPage(page, pageInfo);
    results.push(result);
  }

  await browser.close();

  // Resumo geral
  console.log('\n\n');
  console.log('╔' + '═'.repeat(78) + '╗');
  console.log('║' + ' '.repeat(20) + '📊 RESUMO GERAL DE ACESSIBILIDADE' + ' '.repeat(25) + '║');
  console.log('╚' + '═'.repeat(78) + '╝\n');

  console.log('┌────────────────────────────────────────────────────────────────────────────┐');
  console.log('│ Página                    │ Passou │ Crítico │ Sério │ Moderado │ Menor  │');
  console.log('├────────────────────────────────────────────────────────────────────────────┤');

  let totalPasses = 0;
  let totalCritical = 0;
  let totalSerious = 0;
  let totalModerate = 0;
  let totalMinor = 0;

  results.forEach((result) => {
    if (result.error) {
      console.log(`│ ${result.page.padEnd(25)} │ ERRO                                      │`);
    } else {
      const passes = String(result.passes).padStart(6);
      const critical = String(result.critical).padStart(7);
      const serious = String(result.serious).padStart(5);
      const moderate = String(result.moderate).padStart(8);
      const minor = String(result.minor).padStart(6);
      
      console.log(`│ ${result.page.padEnd(25)} │ ${passes} │ ${critical} │ ${serious} │ ${moderate} │ ${minor} │`);
      
      totalPasses += result.passes;
      totalCritical += result.critical;
      totalSerious += result.serious;
      totalModerate += result.moderate;
      totalMinor += result.minor;
    }
  });

  console.log('├────────────────────────────────────────────────────────────────────────────┤');
  
  const totalPassesStr = String(totalPasses).padStart(6);
  const totalCriticalStr = String(totalCritical).padStart(7);
  const totalSeriousStr = String(totalSerious).padStart(5);
  const totalModerateStr = String(totalModerate).padStart(8);
  const totalMinorStr = String(totalMinor).padStart(6);
  
  console.log(`│ ${'TOTAL'.padEnd(25)} │ ${totalPassesStr} │ ${totalCriticalStr} │ ${totalSeriousStr} │ ${totalModerateStr} │ ${totalMinorStr} │`);
  console.log('└────────────────────────────────────────────────────────────────────────────┘\n');

  // Pontuação de acessibilidade
  const totalTests = totalPasses + totalCritical + totalSerious + totalModerate + totalMinor;
  const score = totalTests > 0 ? Math.round((totalPasses / totalTests) * 100) : 0;

  console.log(`🎯 Pontuação de Acessibilidade: ${score}%\n`);

  if (score >= 90) {
    console.log('✅ Excelente! A plataforma tem alta conformidade com padrões de acessibilidade.');
  } else if (score >= 70) {
    console.log('⚠️  Bom, mas há espaço para melhorias. Priorize correção de problemas críticos.');
  } else if (score >= 50) {
    console.log('⚠️  Atenção! Vários problemas de acessibilidade foram encontrados.');
  } else {
    console.log('❌ Crítico! A plataforma tem sérios problemas de acessibilidade que devem ser corrigidos.');
  }

  console.log('\n📝 Próximos Passos:');
  console.log('   1. Revisar e corrigir problemas críticos e sérios');
  console.log('   2. Testar manualmente com leitores de tela (NVDA, VoiceOver)');
  console.log('   3. Validar navegação por teclado em todas as páginas');
  console.log('   4. Verificar contraste de cores com WebAIM Contrast Checker');
  console.log('   5. Executar este script novamente após correções\n');

  // Exit code baseado em problemas críticos
  if (totalCritical > 0) {
    console.log('❌ Teste falhou: Problemas críticos de acessibilidade encontrados.\n');
    process.exit(1);
  } else if (totalSerious > 0) {
    console.log('⚠️  Teste passou com avisos: Problemas sérios encontrados.\n');
    process.exit(0);
  } else {
    console.log('✅ Teste passou: Nenhum problema crítico ou sério encontrado.\n');
    process.exit(0);
  }
}

// Executar testes
runTests().catch((error) => {
  console.error('\n❌ Erro fatal ao executar testes:', error);
  process.exit(1);
});
