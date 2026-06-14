// ANSI Color Codes for terminal styling
const colors = {
  reset: '\x1b[0m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m',
};

const formatTime = () => {
  return `${colors.dim}[${new Date().toLocaleTimeString()}]${colors.reset}`;
};

export const logger = {
  info: (msg: string) =>
    console.log(`${formatTime()} ${colors.cyan}ℹ INFO${colors.reset}    :: ${msg}`),

  success: (msg: string) =>
    console.log(`${formatTime()} ${colors.green}✔ READY${colors.reset}   :: ${msg}`),

  warn: (msg: string) =>
    console.warn(`${formatTime()} ${colors.yellow}⚠ WARN${colors.reset}    :: ${msg}`),

  error: (msg: string, err?: any) => {
    console.error(`${formatTime()} ${colors.red}✖ ERROR${colors.reset}   :: ${msg}`);
    if (err) console.error(err);
  },

  system: (msg: string) =>
    console.log(`${formatTime()} ${colors.magenta}⚙ SYSTEM${colors.reset}  :: ${msg}`),
};