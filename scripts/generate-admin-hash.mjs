import { stdin, stdout } from 'node:process';
import { createPasswordHash } from '../src/lib/auth.js';

if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
  throw new Error('Run this command in an interactive terminal so the password is not echoed.');
}

async function readHiddenPassword() {
  stdout.write('Admin password (minimum 12 characters; input hidden): ');
  stdin.setRawMode(true);
  stdin.resume();

  return new Promise((resolve, reject) => {
    let password = '';
    const finish = (error) => {
      stdin.off('data', handleInput);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
      if (error) reject(error);
      else resolve(password);
    };

    const handleInput = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') return finish(new Error('Password input cancelled.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u007f' || character === '\b') {
          password = Array.from(password).slice(0, -1).join('');
        } else if (character >= ' ') {
          password += character;
        }
      }
    };

    stdin.on('data', handleInput);
  });
}

try {
  const password = await readHiddenPassword();
  console.log(createPasswordHash(password));
} finally {
  if (stdin.isTTY && stdin.isRaw) stdin.setRawMode(false);
  stdin.pause();
}
