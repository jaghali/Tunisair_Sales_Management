using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddForiegn_key : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EtatVentesDepart_EnteteVente_EnteteVenteID",
                table: "EtatVentesDepart");

            migrationBuilder.AlterColumn<int>(
                name: "EnteteVenteID",
                table: "EtatVentesDepart",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_EtatVentesDepart_EnteteVente_EnteteVenteID",
                table: "EtatVentesDepart",
                column: "EnteteVenteID",
                principalTable: "EnteteVente",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EtatVentesDepart_EnteteVente_EnteteVenteID",
                table: "EtatVentesDepart");

            migrationBuilder.AlterColumn<int>(
                name: "EnteteVenteID",
                table: "EtatVentesDepart",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EtatVentesDepart_EnteteVente_EnteteVenteID",
                table: "EtatVentesDepart",
                column: "EnteteVenteID",
                principalTable: "EnteteVente",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
