using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveForeignKeyEquipageDetailFL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL",
                table: "Equipages");

            migrationBuilder.DropIndex(
                name: "IX_Equipages_NUMFL",
                table: "Equipages");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_DetailFLs_NUMFL",
                table: "DetailFLs");

            migrationBuilder.AddColumn<int>(
                name: "DetailFLNUMFL",
                table: "Equipages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DetailFLNUMVOL",
                table: "Equipages",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Equipages_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages",
                columns: new[] { "DetailFLNUMFL", "DetailFLNUMVOL" });

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFLs_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages",
                columns: new[] { "DetailFLNUMFL", "DetailFLNUMVOL" },
                principalTable: "DetailFLs",
                principalColumns: new[] { "NUMFL", "NUMVOL" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipages_DetailFLs_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages");

            migrationBuilder.DropIndex(
                name: "IX_Equipages_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages");

            migrationBuilder.DropColumn(
                name: "DetailFLNUMFL",
                table: "Equipages");

            migrationBuilder.DropColumn(
                name: "DetailFLNUMVOL",
                table: "Equipages");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_DetailFLs_NUMFL",
                table: "DetailFLs",
                column: "NUMFL");

            migrationBuilder.CreateIndex(
                name: "IX_Equipages_NUMFL",
                table: "Equipages",
                column: "NUMFL");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFLs_NUMFL",
                table: "Equipages",
                column: "NUMFL",
                principalTable: "DetailFLs",
                principalColumn: "NUMFL",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
