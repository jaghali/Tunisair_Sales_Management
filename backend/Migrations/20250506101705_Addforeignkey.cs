using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class Addforeignkey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EnteteVenteID",
                table: "EtatOffresDepart",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ID",
                table: "EtatOffresDepart",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.CreateIndex(
                name: "IX_EtatOffresDepart_EnteteVenteID",
                table: "EtatOffresDepart",
                column: "EnteteVenteID");

            migrationBuilder.AddForeignKey(
                name: "FK_EtatOffresDepart_EnteteVente_EnteteVenteID",
                table: "EtatOffresDepart",
                column: "EnteteVenteID",
                principalTable: "EnteteVente",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EtatOffresDepart_EnteteVente_EnteteVenteID",
                table: "EtatOffresDepart");

            migrationBuilder.DropIndex(
                name: "IX_EtatOffresDepart_EnteteVenteID",
                table: "EtatOffresDepart");

            migrationBuilder.DropColumn(
                name: "EnteteVenteID",
                table: "EtatOffresDepart");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "EtatOffresDepart");
        }
    }
}
