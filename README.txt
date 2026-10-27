EfCalc — modern hesap makinesi projesi

Windows kurulum dosyası:
1. Node.js LTS kurulu olsun: https://nodejs.org/
2. Bu klasörde adres çubuğuna cmd yazıp Enter'a basın.
3. Şunları sırayla çalıştırın:
   npm install
   npm run dist:win
4. Kurulum dosyası dist klasöründe oluşur.

Uygulamayı geliştirme modunda açmak için:
   npm start

macOS DMG oluşturmak için bu proje dosyalarını Mac'e taşıyın, Node.js LTS kurun ve:
   npm install
   npm run dist:mac

Not: Windows .exe ve macOS .dmg burada hazır üretilmiş değil; bu kaynak proje ilgili işletim sisteminde derlenmelidir.

Uygulama simgesi: assets/icon.ico (Windows) ve assets/icon.png (kaynak görsel).
Simgedeki değişikliğin kurulu uygulamaya geçmesi için Windows kurulum dosyasını yeniden üretip kurun.
