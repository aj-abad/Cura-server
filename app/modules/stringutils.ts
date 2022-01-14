<<<<<<< HEAD
export function generateCode(length: number): string {
=======
export function generateCode(length: number, includeLetters: boolean): string {
>>>>>>> 590e88b0623011dd5b84b8eb3202221a5799cda4
  let code = "";
  const possible = "0123456789";
  for (let i = 0; i < length; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}
