
import {
  generatePlaygroundCode,
  getProblem,
  generateTestCode,
  listProblems,
  validateProblem,
  createNewProblem,
  getStats
} from './utils.mjs';
import { program } from 'commander';
import { execa } from 'execa';
import fs from 'fs';
import path from 'path';
import { PLAYGROUND_BASE } from './constants.mjs';

program.name('js-challenges-cli')
  .description('🚀 JavaScript 挑战题目管理工具')
  .version('2.0.0');

program.command('test')
  .argument('<id>', '题目ID')
  .description('🧪 运行指定题目的测试')
  .option('-w, --watch', '监听模式')
  .action(async (id, options) => {
    try {
      const problem = getProblem(id);
      
      if (!problem.hasPlaygroundCode) {
        console.log('❌ 请先创建练习代码:');
        console.log(`   npm run cli create ${id}`);
        process.exit(1);
      }
      
      const testFile = generateTestCode(problem.fullName);
      console.log(`🧪 运行测试: ${problem.fullName}`);
      console.log(`📁 测试文件: ${testFile}`);
      console.log('');
      
      const args = ['vitest', 'run', testFile];
      if (options.watch) {
        args[1] = 'watch';
        console.log('👀 监听模式已启动，修改代码后自动重新测试...');
      }
      
      const result = await execa('npx', args, { stdio: 'inherit' });
      
    } catch (error) {
      if (error.exitCode !== 0) {
        console.log('\n❌ 测试未通过，继续加油！');
      } else {
        console.error('❌ 测试执行失败:', error.message);
      }
      process.exit(1);
    }
  });

program.command('create')
  .argument('<id>', '题目ID')
  .option('-f, --force', '强制覆盖已存在的文件')
  .description('📝 创建题目的练习代码')
  .action((id, options) => {
    try {
      const problem = getProblem(id);
      const filePath = generatePlaygroundCode(problem.fullName, options.force);
      
      console.log('✅ 练习代码已创建!');
      console.log(`📁 文件位置: ${filePath}`);
      console.log('');
      console.log('🎯 下一步:');
      console.log(`   1. 编辑代码: ${filePath}`);
      console.log(`   2. 运行测试: npm run cli test ${id}`);
      console.log(`   3. 监听测试: npm run cli test ${id} --watch`);
      
    } catch (error) {
      console.error('❌ 创建失败:', error.message);
      process.exit(1);
    }
  });

program.command('list')
  .description('📚 列出所有可用的题目')
  .option('-c, --category <category>', '按分类筛选')
  .option('-d, --difficulty <difficulty>', '按难度筛选 (easy|medium|hard)')
  .option('-s, --status <status>', '按状态筛选 (created|pending)')
  .action((options) => {
    try {
      const problems = listProblems(options);
      const stats = getStats();
      
      console.log('📊 题目统计:');
      console.log(`   总计: ${stats.total} 题`);
      console.log(`   已创建: ${stats.created} 题`);
      console.log(`   进度: ${stats.progress}%`);
      console.log(`   难度分布: 简单 ${stats.byDifficulty.easy || 0} | 中等 ${stats.byDifficulty.medium || 0} | 困难 ${stats.byDifficulty.hard || 0}`);
      console.log('');
      
      if (problems.length === 0) {
        console.log('🔍 没有找到匹配的题目');
        return;
      }
      
      console.log(`📚 题目列表 (${problems.length} 题):\n`);
      
      problems.forEach((problem, index) => {
        const difficultyIcon = {
          easy: '🟢',
          medium: '🟡', 
          hard: '🔴'
        }[problem.difficulty] || '⚪';
        
        console.log(`${(index + 1).toString().padStart(2)}. ${difficultyIcon} ${problem.name} ${problem.status}`);
        if (problem.description) {
          console.log(`    ${problem.description}`);
        }
        console.log('');
      });
      
      console.log('💡 使用提示:');
      console.log('   创建练习: npm run cli create <id>');
      console.log('   查看详情: npm run cli info <id>');
      console.log('   运行测试: npm run cli test <id>');
      
    } catch (error) {
      console.error('❌ 列表获取失败:', error.message);
      process.exit(1);
    }
  });

program.command('validate')
  .argument('[id]', 'problem id to validate (optional, validates all if not provided)')
  .description('验证题目结构是否正确')
  .action((id) => {
    try {
      if (id) {
        const problem = getProblem(id);
        const isValid = validateProblem(problem.fullName);
        if (isValid) {
          console.log('✅ 题目结构验证通过:', problem.fullName);
        } else {
          console.log('❌ 题目结构验证失败:', problem.fullName);
          process.exit(1);
        }
      } else {
        const problems = listProblems();
        let allValid = true;
        problems.forEach(problem => {
          const isValid = validateProblem(problem.name);
          if (isValid) {
            console.log('✅', problem.name);
          } else {
            console.log('❌', problem.name);
            allValid = false;
          }
        });
        if (allValid) {
          console.log('\n🎉 所有题目结构验证通过!');
        } else {
          console.log('\n❌ 部分题目结构验证失败!');
          process.exit(1);
        }
      }
    } catch (error) {
      console.error('❌ 验证失败:', error.message);
      process.exit(1);
    }
  });

program.command('new')
  .argument('<name>', '新题目名称')
  .description('🆕 创建新的题目模板')
  .option('-t, --template <template>', '使用指定模板', 'basic')
  .option('-c, --category <category>', '题目分类', 'general')
  .option('-d, --difficulty <difficulty>', '题目难度 (easy|medium|hard)', 'medium')
  .action((name, options) => {
    try {
      const problemPath = createNewProblem(name, options);
      
      console.log('✅ 新题目模板已创建!');
      console.log(`📁 位置: ${problemPath}`);
      console.log('');
      console.log('📝 请编辑以下文件:');
      console.log(`   📖 题目描述: ${path.join(problemPath, 'README.md')}`);
      console.log(`   📄 代码模板: ${path.join(problemPath, 'template.js')}`);
      console.log(`   🧪 测试用例: ${path.join(problemPath, 'test.js')}`);
      console.log('');
      console.log('🎯 完成后可以:');
      console.log(`   验证结构: npm run cli validate ${name}`);
      console.log(`   创建练习: npm run cli create ${name}`);
      
    } catch (error) {
      console.error('❌ 创建失败:', error.message);
      process.exit(1);
    }
  });

program.command('info')
  .argument('<id>', '题目ID')
  .description('📋 显示题目详细信息')
  .action((id) => {
    try {
      const problem = getProblem(id);
      
      console.log('📋 题目信息:\n');
      console.log(`🏷️  名称: ${problem.fullName}`);
      console.log(`📁 路径: ${problem.path}`);
      console.log(`📝 模板: ${problem.hasTemplate ? '✅' : '❌'}`);
      console.log(`🧪 测试: ${problem.hasTest ? '✅' : '❌'}`);
      console.log(`💻 练习: ${problem.hasPlaygroundCode ? '✅ 已创建' : '⭕ 未创建'}`);
      
      if (problem.hasPlaygroundCode) {
        console.log(`📄 练习文件: ${problem.playgroundCodePath}`);
      }
      
      // 读取 README 内容
      if (fs.existsSync(problem.descriptionPath)) {
        const content = fs.readFileSync(problem.descriptionPath, 'utf-8');
        console.log('\n📖 题目描述:');
        console.log('─'.repeat(50));
        console.log(content);
        console.log('─'.repeat(50));
      }
      
      console.log('\n🎯 快速操作:');
      if (!problem.hasPlaygroundCode) {
        console.log(`   创建练习: npm run cli create ${id}`);
      } else {
        console.log(`   运行测试: npm run cli test ${id}`);
        console.log(`   监听测试: npm run cli test ${id} --watch`);
      }
      
    } catch (error) {
      console.error('❌ 获取信息失败:', error.message);
      process.exit(1);
    }
  });

// 添加统计命令
program.command('stats')
  .description('📊 显示题目统计信息')
  .action(() => {
    try {
      const stats = getStats();
      const problems = listProblems();
      
      console.log('📊 JS Challenges 统计信息\n');
      console.log(`📚 总题目数: ${stats.total}`);
      console.log(`✅ 已创建练习: ${stats.created}`);
      console.log(`⭕ 待开始: ${stats.remaining}`);
      console.log(`📈 完成进度: ${stats.progress}%`);
      console.log('');
      
      console.log('🎯 难度分布:');
      console.log(`   🟢 简单: ${stats.byDifficulty.easy || 0} 题`);
      console.log(`   🟡 中等: ${stats.byDifficulty.medium || 0} 题`);
      console.log(`   🔴 困难: ${stats.byDifficulty.hard || 0} 题`);
      console.log('');
      
      // 显示最近的题目
      const recentProblems = problems.slice(0, 5);
      console.log('🔥 推荐题目:');
      recentProblems.forEach((p, i) => {
        const icon = p.hasPlayground ? '✅' : '⭕';
        console.log(`   ${i + 1}. ${icon} ${p.name}`);
      });
      
    } catch (error) {
      console.error('❌ 获取统计失败:', error.message);
      process.exit(1);
    }
  });

// 添加清理命令
program.command('clean')
  .description('🧹 清理生成的文件')
  .option('-a, --all', '清理所有生成文件')
  .option('-c, --cache', '只清理缓存文件')
  .action(async (options) => {
    try {
      const { CACHE_BASE } = await import('./constants.mjs');
      
      if (options.cache || options.all) {
        if (fs.existsSync(CACHE_BASE)) {
          fs.rmSync(CACHE_BASE, { recursive: true, force: true });
          console.log('✅ 缓存文件已清理');
        }
      }
      
      if (options.all) {
        if (fs.existsSync(PLAYGROUND_BASE)) {
          fs.rmSync(PLAYGROUND_BASE, { recursive: true, force: true });
          console.log('✅ 练习文件已清理');
        }
      }
      
      if (!options.cache && !options.all) {
        console.log('请指定清理选项:');
        console.log('  --cache  清理缓存文件');
        console.log('  --all    清理所有生成文件');
      }
      
    } catch (error) {
      console.error('❌ 清理失败:', error.message);
      process.exit(1);
    }
  });

program.parseAsync().catch((e) => {
  console.error(`❌ ${e.name}: ${e.message}` || e);
  process.exit(1);
});