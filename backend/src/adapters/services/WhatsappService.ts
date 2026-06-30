export class WhatsappService {
  gerarLink(telefone: string, mensagem: string) {
    const numero = telefone.replace(/\D/g, "");
    const texto = encodeURIComponent(mensagem);

    return `https://wa.me/55${numero}?text=${texto}`;
  }
}