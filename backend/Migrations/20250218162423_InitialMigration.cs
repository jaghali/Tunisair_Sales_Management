using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Qt6CompJ",
                table: "EtatVentesDepart",
                newName: "QtDotation");

            migrationBuilder.RenameColumn(
                name: "Qt4Dotation",
                table: "EtatVentesDepart",
                newName: "QtCompJ");

            migrationBuilder.RenameColumn(
                name: "Tot# Em",
                table: "EtatVentesArrivee",
                newName: "TotEm");

            migrationBuilder.RenameColumn(
                name: "Quantité vendue",
                table: "EtatVentesArrivee",
                newName: "QuantiteVendue");

            migrationBuilder.RenameColumn(
                name: "Quantité Dotation",
                table: "EtatVentesArrivee",
                newName: "QuantiteDotation");

            migrationBuilder.RenameColumn(
                name: "Prix Unitaire HT",
                table: "EtatVentesArrivee",
                newName: "PrixUnitaireHT");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "EtatVentesDepart",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Restant",
                table: "EtatVentesArrivee",
                type: "int",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "QtDotation",
                table: "EtatVentesDepart",
                newName: "Qt6CompJ");

            migrationBuilder.RenameColumn(
                name: "QtCompJ",
                table: "EtatVentesDepart",
                newName: "Qt4Dotation");

            migrationBuilder.RenameColumn(
                name: "TotEm",
                table: "EtatVentesArrivee",
                newName: "Tot# Em");

            migrationBuilder.RenameColumn(
                name: "QuantiteVendue",
                table: "EtatVentesArrivee",
                newName: "Quantité vendue");

            migrationBuilder.RenameColumn(
                name: "QuantiteDotation",
                table: "EtatVentesArrivee",
                newName: "Quantité Dotation");

            migrationBuilder.RenameColumn(
                name: "PrixUnitaireHT",
                table: "EtatVentesArrivee",
                newName: "Prix Unitaire HT");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "EtatVentesDepart",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Restant",
                table: "EtatVentesArrivee",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
