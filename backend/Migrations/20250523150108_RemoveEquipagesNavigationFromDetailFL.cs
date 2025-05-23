using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemoveEquipagesNavigationFromDetailFL : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipages_DetailFL_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Equipages",
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

            migrationBuilder.RenameTable(
                name: "Equipages",
                newName: "Equipage");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Equipage",
                table: "Equipage",
                column: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Equipage",
                table: "Equipage");

            migrationBuilder.RenameTable(
                name: "Equipage",
                newName: "Equipages");

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

            migrationBuilder.AddPrimaryKey(
                name: "PK_Equipages",
                table: "Equipages",
                column: "ID");

            migrationBuilder.CreateIndex(
                name: "IX_Equipages_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages",
                columns: new[] { "DetailFLNUMFL", "DetailFLNUMVOL" });

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFL_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages",
                columns: new[] { "DetailFLNUMFL", "DetailFLNUMVOL" },
                principalTable: "DetailFL",
                principalColumns: new[] { "NUMFL", "NUMVOL" });
        }
    }
}
