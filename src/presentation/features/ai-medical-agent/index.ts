/**
 * 🧠 NEURAL MEDICAL CHAT SYSTEM V13.0 - INDEX
 * Exportaciones centralizadas del sistema de chat médico modular
 */

// 🎯 TIPOS Y INTERFACES
export * from './types/ChatTypes';

// 🧠 MOTORES DE CHAT
export { MedicalAIChatEngine } from './engines/MedicalChatEngine';
export { MedicalResponseGenerator } from './engines/MedicalResponseGenerator';

// 🎨 COMPONENTES UI
export { ChatUIComponents } from './components/ChatUIComponents';

// 🤖 COMPONENTE PRINCIPAL REFACTORIZADO
export { default as AIChat } from './components/AIChat';

// 🔄 COMPONENTE ORIGINAL (DEPRECATED)
// export { default as AIChat } from './components/AIChat'; // Will be removed after migration
