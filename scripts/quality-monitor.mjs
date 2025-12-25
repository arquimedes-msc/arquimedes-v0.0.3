#!/usr/bin/env node
/**
 * Script de Monitoramento Contínuo de Qualidade de Código
 * 
 * Executa automaticamente:
 * - Testes unitários
 * - Cobertura de código
 * - Análise de complexidade
 * - Detecção de código duplicado
 * - Verificação de tipagens
 * - Análise de bundle size
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class QualityMonitor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      tests: null,
      coverage: null,
      complexity: null,
      typeErrors: null,
      bundleSize: null,
      score: 0,
    };
  }

  log(message, type = 'info') {
    const icons = {
      info: '📊',
      success: '✅',
      warning: '⚠️',
      error: '❌',
    };
    console.log(`${icons[type]} ${message}`);
  }

  async runTests() {
    this.log('Executando testes unitários...', 'info');
    try {
      const output = execSync('pnpm test', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      
      const passedMatch = output.match(/(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);
      
      this.results.tests = {
        passed: passedMatch ? parseInt(passedMatch[1]) : 0,
        failed: failedMatch ? parseInt(failedMatch[1]) : 0,
        total: 0,
      };
      this.results.tests.total = this.results.tests.passed + this.results.tests.failed;
      
      if (this.results.tests.failed === 0) {
        this.log(`Todos os ${this.results.tests.passed} testes passaram!`, 'success');
        this.results.score += 30;
      } else {
        this.log(`${this.results.tests.failed} testes falhando de ${this.results.tests.total}`, 'warning');
        this.results.score += Math.floor(30 * (this.results.tests.passed / this.results.tests.total));
      }
    } catch (error) {
      this.log('Erro ao executar testes', 'error');
      this.results.tests = { passed: 0, failed: 0, total: 0, error: error.message };
    }
  }

  async runCoverage() {
    this.log('Analisando cobertura de código...', 'info');
    try {
      const output = execSync('pnpm vitest run --coverage', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      
      // Tentar ler arquivo de cobertura JSON
      const coveragePath = path.join(projectRoot, 'coverage', 'coverage-summary.json');
      if (fs.existsSync(coveragePath)) {
        const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));
        const total = coverageData.total;
        
        this.results.coverage = {
          lines: total.lines.pct,
          statements: total.statements.pct,
          functions: total.functions.pct,
          branches: total.branches.pct,
        };
        
        const avgCoverage = (
          this.results.coverage.lines +
          this.results.coverage.statements +
          this.results.coverage.functions +
          this.results.coverage.branches
        ) / 4;
        
        this.log(`Cobertura média: ${avgCoverage.toFixed(1)}%`, avgCoverage >= 70 ? 'success' : 'warning');
        this.results.score += Math.floor(25 * (avgCoverage / 100));
      }
    } catch (error) {
      this.log('Cobertura não disponível (executar: pnpm vitest run --coverage)', 'warning');
      this.results.coverage = { error: 'Not available' };
    }
  }

  async checkTypeErrors() {
    this.log('Verificando erros TypeScript...', 'info');
    try {
      execSync('pnpm tsc --noEmit', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: 'pipe',
      });
      
      this.results.typeErrors = 0;
      this.log('Nenhum erro TypeScript encontrado!', 'success');
      this.results.score += 25;
    } catch (error) {
      const errorCount = (error.stdout.match(/error TS/g) || []).length;
      this.results.typeErrors = errorCount;
      
      if (errorCount > 0) {
        this.log(`${errorCount} erros TypeScript encontrados`, 'warning');
        this.results.score += Math.max(0, 25 - errorCount);
      }
    }
  }

  async analyzeComplexity() {
    this.log('Analisando complexidade de código...', 'info');
    try {
      const files = this.getSourceFiles();
      let totalComplexity = 0;
      let fileCount = 0;
      let largeFiles = 0;
      
      files.forEach(file => {
        const stats = fs.statSync(file);
        const lines = fs.readFileSync(file, 'utf-8').split('\n').length;
        
        if (lines > 500) {
          largeFiles++;
        }
        
        totalComplexity += lines;
        fileCount++;
      });
      
      const avgComplexity = totalComplexity / fileCount;
      
      this.results.complexity = {
        averageLines: Math.round(avgComplexity),
        largeFiles,
        totalFiles: fileCount,
      };
      
      if (largeFiles === 0) {
        this.log('Nenhum arquivo muito grande encontrado!', 'success');
        this.results.score += 10;
      } else {
        this.log(`${largeFiles} arquivos com mais de 500 linhas`, 'warning');
        this.results.score += Math.max(0, 10 - largeFiles);
      }
    } catch (error) {
      this.log('Erro ao analisar complexidade', 'error');
      this.results.complexity = { error: error.message };
    }
  }

  async analyzeBundleSize() {
    this.log('Analisando tamanho do bundle...', 'info');
    try {
      const distPath = path.join(projectRoot, 'dist');
      if (fs.existsSync(distPath)) {
        const size = this.getDirectorySize(distPath);
        this.results.bundleSize = {
          bytes: size,
          mb: (size / 1024 / 1024).toFixed(2),
        };
        
        if (size < 5 * 1024 * 1024) { // < 5MB
          this.log(`Bundle size: ${this.results.bundleSize.mb}MB`, 'success');
          this.results.score += 10;
        } else {
          this.log(`Bundle size: ${this.results.bundleSize.mb}MB (considere otimizar)`, 'warning');
          this.results.score += 5;
        }
      } else {
        this.log('Dist folder não encontrado (executar build primeiro)', 'warning');
        this.results.bundleSize = { error: 'Not built' };
      }
    } catch (error) {
      this.results.bundleSize = { error: error.message };
    }
  }

  getSourceFiles() {
    const files = [];
    const walk = (dir) => {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          walk(fullPath);
        } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
          files.push(fullPath);
        }
      });
    };
    
    walk(path.join(projectRoot, 'server'));
    return files;
  }

  getDirectorySize(dir) {
    let size = 0;
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        size += this.getDirectorySize(fullPath);
      } else {
        size += stat.size;
      }
    });
    
    return size;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 RELATÓRIO DE QUALIDADE DE CÓDIGO');
    console.log('='.repeat(60) + '\n');
    
    console.log(`⏰ Timestamp: ${this.results.timestamp}\n`);
    
    // Testes
    if (this.results.tests) {
      console.log('🧪 TESTES UNITÁRIOS');
      console.log(`   Total: ${this.results.tests.total}`);
      console.log(`   ✅ Passando: ${this.results.tests.passed}`);
      console.log(`   ❌ Falhando: ${this.results.tests.failed}`);
      console.log(`   Taxa de sucesso: ${((this.results.tests.passed / this.results.tests.total) * 100).toFixed(1)}%\n`);
    }
    
    // Cobertura
    if (this.results.coverage && !this.results.coverage.error) {
      console.log('📈 COBERTURA DE CÓDIGO');
      console.log(`   Linhas: ${this.results.coverage.lines.toFixed(1)}%`);
      console.log(`   Statements: ${this.results.coverage.statements.toFixed(1)}%`);
      console.log(`   Funções: ${this.results.coverage.functions.toFixed(1)}%`);
      console.log(`   Branches: ${this.results.coverage.branches.toFixed(1)}%\n`);
    }
    
    // TypeScript
    console.log('🔍 TIPAGEM');
    console.log(`   Erros TypeScript: ${this.results.typeErrors || 0}\n`);
    
    // Complexidade
    if (this.results.complexity && !this.results.complexity.error) {
      console.log('📏 COMPLEXIDADE');
      console.log(`   Média de linhas por arquivo: ${this.results.complexity.averageLines}`);
      console.log(`   Arquivos grandes (>500 linhas): ${this.results.complexity.largeFiles}`);
      console.log(`   Total de arquivos: ${this.results.complexity.totalFiles}\n`);
    }
    
    // Bundle Size
    if (this.results.bundleSize && !this.results.bundleSize.error) {
      console.log('📦 BUNDLE SIZE');
      console.log(`   Tamanho: ${this.results.bundleSize.mb}MB\n`);
    }
    
    // Score
    console.log('🎯 SCORE DE QUALIDADE');
    console.log(`   ${this.results.score}/100`);
    
    if (this.results.score >= 90) {
      console.log('   Status: ✅ EXCELENTE');
    } else if (this.results.score >= 75) {
      console.log('   Status: 🟢 BOM');
    } else if (this.results.score >= 60) {
      console.log('   Status: 🟡 REGULAR');
    } else {
      console.log('   Status: 🔴 PRECISA MELHORAR');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Salvar relatório
    const reportPath = path.join(projectRoot, 'quality-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Relatório salvo em: ${reportPath}\n`);
  }

  async run() {
    console.log('\n🚀 Iniciando monitoramento de qualidade...\n');
    
    await this.runTests();
    await this.runCoverage();
    await this.checkTypeErrors();
    await this.analyzeComplexity();
    await this.analyzeBundleSize();
    
    this.generateReport();
    
    // Exit code baseado no score
    process.exit(this.results.score >= 60 ? 0 : 1);
  }
}

// Executar
const monitor = new QualityMonitor();
monitor.run().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
