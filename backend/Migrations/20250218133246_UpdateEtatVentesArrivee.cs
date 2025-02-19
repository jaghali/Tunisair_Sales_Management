using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEtatVentesArrivee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EtatOffresArrivee",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantiteDotation = table.Column<int>(type: "int", nullable: false),
                    TotEm = table.Column<int>(type: "int", nullable: false),
                    QuantiteOfferte = table.Column<int>(type: "int", nullable: false),
                    Restant = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EtatOffresArrivee", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "EtatOffresDepart",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantiteDotation = table.Column<int>(type: "int", nullable: false),
                    TotEm = table.Column<int>(type: "int", nullable: false),
                    QuantiteOfferte = table.Column<int>(type: "int", nullable: false),
                    Restant = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "EtatVentesArrivee",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    QuantitéDotation = table.Column<int>(name: "Quantité Dotation", type: "int", nullable: false),
                    TotEm = table.Column<decimal>(name: "Tot# Em", type: "decimal(18,2)", nullable: false),
                    Quantitévendue = table.Column<int>(name: "Quantité vendue", type: "int", nullable: false),
                    PrixUnitaireHT = table.Column<decimal>(name: "Prix Unitaire HT", type: "decimal(18,2)", nullable: false),
                    Valeur = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Restant = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "EtatVentesDepart",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Qt4Dotation = table.Column<int>(type: "int", nullable: false),
                    Qt6CompJ = table.Column<int>(type: "int", nullable: false),
                    TotEm = table.Column<int>(type: "int", nullable: false),
                    QuantiteCasse = table.Column<int>(type: "int", nullable: false),
                    QuantiteOffre = table.Column<int>(type: "int", nullable: false),
                    QuantiteVente = table.Column<int>(type: "int", nullable: false),
                    PrixUnitaireHT = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Valeur = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Restant = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EtatOffresArrivee");

            migrationBuilder.DropTable(
                name: "EtatOffresDepart");

            migrationBuilder.DropTable(
                name: "EtatVentesArrivee");

            migrationBuilder.DropTable(
                name: "EtatVentesDepart");
        }
    }
}
