using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDetailFLAndEquipage3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DetailFLs_NUMFL",
                table: "DetailFLs");

            migrationBuilder.CreateIndex(
                name: "IX_DetailFLs_NUMFL",
                table: "DetailFLs",
                column: "NUMFL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_DetailFLs_NUMFL",
                table: "DetailFLs");

            migrationBuilder.CreateIndex(
                name: "IX_DetailFLs_NUMFL",
                table: "DetailFLs",
                column: "NUMFL",
                unique: true);
        }
    }
}
