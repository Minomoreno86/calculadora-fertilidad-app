/**
 * 🚀 SISTEMA DE LOGGING INTELIGENTE Y OPTIMIZADO
 * 
 * Este sistema permite mantener toda la funcionalidad de debug
 * mientras optimiza el rendimiento en producción.
 * 
 * Características:
 * - Logging condicional basado en niveles
 * - Batching de logs para reducir overhead
 * - Métricas de performance integradas
 * - Export de logs para debugging
 */

// 🔧 Detectar entorno de desarrollo
declare const __DEV__: boolean | undefined;
const isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

export enum LogLevel {
  OFF = 0,
  ERROR = 1,
  WARN = 2,
  INFO = 3,
  DEBUG = 4,
  VERBOSE = 5
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  category: string;
  message: string;
  data?: unknown;
}

export interface LoggerConfig {
  level: LogLevel;
  enableBatching: boolean;
  batchSize: number;
  enableMetrics: boolean;
  categories: string[];
  maxEntries: number;
}

class SmartLogger {
  private config: LoggerConfig = {
    level: isDevelopment ? LogLevel.DEBUG : LogLevel.WARN,
    enableBatching: true,
    batchSize: 10,
    enableMetrics: true,
    categories: ['cache', 'calculation', 'validation', 'performance'],
    maxEntries: 1000
  };

  private logBuffer: LogEntry[] = [];
  private metrics = {
    totalLogs: 0,
    logsByLevel: new Map<LogLevel, number>(),
    avgLogTime: 0,
    lastFlush: Date.now()
  };

  private timers = new Map<string, number>();

  configure(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // 🚀 Método principal de logging optimizado
  private log(level: LogLevel, category: string, message: string, data?: unknown): void {
    // Verificación rápida de nivel
    if (level > this.config.level) return;
    
    // Verificación de categoría
    if (this.config.categories.length > 0 && !this.config.categories.includes(category)) {
      return;
    }

    // Protección defensiva
    if (!this.logBuffer) {
      console.warn('SmartLogger: logBuffer no inicializado, usando fallback');
      console.log(`[${LogLevel[level]}] [${category}] ${message}`, data);
      return;
    }

    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      category,
      message,
      data
    };

    if (this.config.enableBatching) {
      this.logBuffer.push(entry);
      if (this.logBuffer.length >= this.config.batchSize) {
        this.flushLogs();
      }
    } else {
      this.outputLog(entry);
    }

    // Actualizar métricas
    if (this.config.enableMetrics) {
      this.updateMetrics(level);
    }
  }

  // 🎯 Métodos públicos optimizados
  error(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.ERROR, category, message, data);
  }

  warn(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.WARN, category, message, data);
  }

  info(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.INFO, category, message, data);
  }

  debug(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, category, message, data);
  }

  verbose(category: string, message: string, data?: unknown): void {
    this.log(LogLevel.VERBOSE, category, message, data);
  }

  // 🕐 Métodos de timing para performance
  startTimer(name: string): void {
    if (!this.timers) {
      console.warn('SmartLogger: timers Map no inicializado');
      return;
    }
    this.timers.set(name, Date.now());
  }

  endTimer(name: string, category: string = 'performance'): number {
    if (!this.timers) {
      console.warn('SmartLogger: timers Map no inicializado');
      return 0;
    }
    
    const startTime = this.timers.get(name);
    if (!startTime) {
      this.warn('timer', `Timer "${name}" no existe`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(name);
    
    this.debug(category, `⏱️ ${name}: ${duration}ms`);
    return duration;
  }

  // 🧠 Métodos para análisis específicos
  cacheHit(hash: string, compressionRatio?: number, predictive?: boolean): void {
    if (this.config.level >= LogLevel.DEBUG) {
      const emoji = predictive ? '🎯🔮' : '🎯';
      const compression = compressionRatio ? ` (${Math.round((1-compressionRatio)*100)}% ahorro)` : '';
      this.debug('cache', `${emoji} CACHE HIT: ${hash}${compression}`);
    }
  }

  cacheSave(hash: string, compressionRatio: number, predictiveScore: number): void {
    if (this.config.level >= LogLevel.DEBUG) {
      this.debug('cache', `💾 CACHE SAVE: ${hash} (compresión: ${Math.round((1-compressionRatio)*100)}%, predictive: ${predictiveScore.toFixed(2)})`);
    }
  }

  cacheCleanup(removed: number, kept: number, hashes?: string[]): void {
    if (this.config.level >= LogLevel.INFO) {
      this.info('cache', `🧹 CACHE CLEANUP: ${removed} eliminadas, ${kept} conservadas`);
      if (this.config.level >= LogLevel.DEBUG && hashes) {
        this.debug('cache', `Eliminadas: ${hashes.join(', ')}`);
      }
    }
  }

  calculationStart(userInput: unknown): void {
    if (this.config.level >= LogLevel.DEBUG) {
      this.debug('calculation', '🚀 INICIANDO CÁLCULO');
      if (this.config.level >= LogLevel.VERBOSE) {
        this.verbose('calculation', 'Input completo', userInput);
      }
    }
  }

  calculationEnd(result: unknown, duration?: number): void {
    if (this.config.level >= LogLevel.DEBUG) {
      const timing = duration ? ` (${duration}ms)` : '';
      this.debug('calculation', `✅ CÁLCULO COMPLETADO${timing}`);
      if (this.config.level >= LogLevel.VERBOSE) {
        this.verbose('calculation', 'Resultado completo', result);
      }
    }
  }

  // 🔄 Gestión de buffer
  private flushLogs(): void {
    if (this.logBuffer.length === 0) return;

    // Ordenar por timestamp y nivel
    this.logBuffer.sort((a, b) => {
      if (a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
      return a.level - b.level;
    });

    // Output batch
    this.logBuffer.forEach(entry => this.outputLog(entry));
    
    // Limpiar buffer
    this.logBuffer = [];
    this.metrics.lastFlush = Date.now();
  }

  private outputLog(entry: LogEntry): void {
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString().split('T')[1].split('.')[0];
    const prefix = `[${timestamp}] [${levelName}] [${entry.category}]`;
    
    if (entry.data !== undefined) {
      console.log(`${prefix} ${entry.message}`, entry.data);
    } else {
      console.log(`${prefix} ${entry.message}`);
    }
  }

  private updateMetrics(level: LogLevel): void {
    this.metrics.totalLogs++;
    const currentCount = this.metrics.logsByLevel.get(level) || 0;
    this.metrics.logsByLevel.set(level, currentCount + 1);
  }

  // 📊 Métodos de análisis y export
  getMetrics() {
    return {
      ...this.metrics,
      bufferSize: this.logBuffer.length,
      timeSinceLastFlush: Date.now() - this.metrics.lastFlush,
      activeTimers: this.timers.size
    };
  }

  exportLogs(): LogEntry[] {
    this.flushLogs(); // Asegurar que todo esté flushed
    return [...this.logBuffer];
  }

  // 🧪 Métodos para testing y debugging
  enableVerboseMode(): void {
    this.configure({ level: LogLevel.VERBOSE });
  }

  enableProductionMode(): void {
    this.configure({ 
      level: LogLevel.WARN,
      enableBatching: true,
      batchSize: 20
    });
  }

  clearLogs(): void {
    this.logBuffer = [];
    this.timers.clear();
  }

  // Forzar flush manual
  flush(): void {
    this.flushLogs();
  }
}

// 🌟 Instancia singleton optimizada
export const smartLogger = new SmartLogger();

// 🔧 Configuración automática basada en entorno
if (isDevelopment) {
  smartLogger.configure({
    level: LogLevel.DEBUG,
    enableBatching: true,
    batchSize: 5,
    categories: ['cache', 'calculation', 'validation', 'performance']
  });
} else {
  smartLogger.configure({
    level: LogLevel.WARN,
    enableBatching: true,
    batchSize: 20,
    categories: ['cache', 'calculation'] // Solo lo esencial en producción
  });
}

// 🚀 Export de métodos de conveniencia con bind correcto
export const error = smartLogger.error.bind(smartLogger);
export const warn = smartLogger.warn.bind(smartLogger);
export const info = smartLogger.info.bind(smartLogger);
export const debug = smartLogger.debug.bind(smartLogger);
export const verbose = smartLogger.verbose.bind(smartLogger);
export const startTimer = smartLogger.startTimer.bind(smartLogger);
export const endTimer = smartLogger.endTimer.bind(smartLogger);
export const cacheHit = smartLogger.cacheHit.bind(smartLogger);
export const cacheSave = smartLogger.cacheSave.bind(smartLogger);
export const cacheCleanup = smartLogger.cacheCleanup.bind(smartLogger);
export const calculationStart = smartLogger.calculationStart.bind(smartLogger);
export const calculationEnd = smartLogger.calculationEnd.bind(smartLogger);

export default smartLogger;
