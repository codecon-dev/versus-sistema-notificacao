const { Client } = require("pg");

async function testDatabase() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "notifications",
  });

  try {
    await client.connect();
    console.log("✅ Conectado ao banco de dados\n");

    // Total de recipients
    const total = await client.query(
      "SELECT COUNT(*) FROM notification_recipients",
    );
    console.log("📊 Total de recipients:", total.rows[0].count);

    // Recipients não lidos (read_at IS NULL)
    const unread = await client.query(
      "SELECT COUNT(*) FROM notification_recipients WHERE read_at IS NULL",
    );
    console.log("📧 Não lidos (read_at IS NULL):", unread.rows[0].count);

    // Recipients lidos (read_at IS NOT NULL)
    const read = await client.query(
      "SELECT COUNT(*) FROM notification_recipients WHERE read_at IS NOT NULL",
    );
    console.log("✅ Lidos (read_at IS NOT NULL):", read.rows[0].count);

    // Amostras
    const samples = await client.query(
      "SELECT id, notification_id, user_id, read_at, received_at FROM notification_recipients LIMIT 10",
    );
    console.log("\n📋 Amostras de recipients:");
    console.table(samples.rows);

    // Cálculo manual
    const totalNum = parseInt(total.rows[0].count);
    const unreadNum = parseInt(unread.rows[0].count);
    const readNum = totalNum - unreadNum;
    const readRate =
      totalNum > 0 ? ((readNum / totalNum) * 100).toFixed(1) : "0.0";

    console.log("\n🧮 Cálculo manual:");
    console.log(`Total: ${totalNum}`);
    console.log(`Não lidos: ${unreadNum}`);
    console.log(`Lidos: ${readNum} (${totalNum} - ${unreadNum})`);
    console.log(`Taxa de leitura: ${readRate}%`);
  } catch (error) {
    console.error("❌ Erro:", error);
  } finally {
    await client.end();
  }
}

testDatabase();
