using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPrimaryKeyToEtatOffresArrivee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "EtatVentesDepart",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "EtatVentesArrivee",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "EtatOffresDepart",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EtatVentesDepart",
                table: "EtatVentesDepart",
                column: "Code");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EtatVentesArrivee",
                table: "EtatVentesArrivee",
                column: "Code");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EtatOffresDepart",
                table: "EtatOffresDepart",
                column: "Code");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EtatVentesDepart",
                table: "EtatVentesDepart");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EtatVentesArrivee",
                table: "EtatVentesArrivee");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EtatOffresDepart",
                table: "EtatOffresDepart");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "EtatVentesDepart",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "EtatVentesArrivee",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "EtatOffresDepart",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
