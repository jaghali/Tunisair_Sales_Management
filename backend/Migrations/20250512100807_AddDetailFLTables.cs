using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDetailFLTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipages_DetailFLs_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages");

            migrationBuilder.DropTable(
                name: "DetailFLs");

            migrationBuilder.CreateTable(
                name: "DetailFL",
                columns: table => new
                {
                    NUMFL = table.Column<int>(type: "int", nullable: false),
                    NUMVOL = table.Column<int>(type: "int", nullable: false),
                    CIE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATEVOL = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ESCALEDEP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ESCALEARR = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NUMORDRE = table.Column<int>(type: "int", nullable: true),
                    DATEDEPPREV = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HEUREBBDEP = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HEUREBBARR = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DUREEVOLBB = table.Column<int>(type: "int", nullable: true),
                    HEUREABDEP = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HEUREABARR = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DUREEVOLAB = table.Column<int>(type: "int", nullable: true),
                    CARBVOLPREC = table.Column<int>(type: "int", nullable: true),
                    CARBRAVUNITE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CARBRAV = table.Column<int>(type: "int", nullable: true),
                    CARBCOEFCONV = table.Column<float>(type: "real", nullable: true),
                    CARBRAVKG = table.Column<int>(type: "int", nullable: true),
                    CARBJAUGEDEP = table.Column<int>(type: "int", nullable: true),
                    CARBJAUGEARR = table.Column<int>(type: "int", nullable: true),
                    CARBCONSOM = table.Column<int>(type: "int", nullable: true),
                    VOLOPERATIONNEL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATEVOLOP = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MAT = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetailFL", x => new { x.NUMFL, x.NUMVOL });
                });

            migrationBuilder.CreateIndex(
                name: "IX_DetailFL_NUMFL",
                table: "DetailFL",
                column: "NUMFL");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFL_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages",
                columns: new[] { "DetailFLNUMFL", "DetailFLNUMVOL" },
                principalTable: "DetailFL",
                principalColumns: new[] { "NUMFL", "NUMVOL" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Equipages_DetailFL_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages");

            migrationBuilder.DropTable(
                name: "DetailFL");

            migrationBuilder.CreateTable(
                name: "DetailFLs",
                columns: table => new
                {
                    NUMFL = table.Column<int>(type: "int", nullable: false),
                    NUMVOL = table.Column<int>(type: "int", nullable: false),
                    CARBCOEFCONV = table.Column<float>(type: "real", nullable: false),
                    CARBCONSOM = table.Column<int>(type: "int", nullable: false),
                    CARBJAUGEARR = table.Column<int>(type: "int", nullable: false),
                    CARBJAUGEDEP = table.Column<int>(type: "int", nullable: false),
                    CARBRAV = table.Column<int>(type: "int", nullable: false),
                    CARBRAVKG = table.Column<int>(type: "int", nullable: false),
                    CARBRAVUNITE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CARBVOLPREC = table.Column<int>(type: "int", nullable: false),
                    CIE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATEDEPPREV = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DATEVOL = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DATEVOLOP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DUREEVOLAB = table.Column<int>(type: "int", nullable: false),
                    DUREEVOLBB = table.Column<int>(type: "int", nullable: false),
                    ESCALEARR = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ESCALEDEP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HEUREABARR = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREABDEP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREBBARR = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREBBDEP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MAT = table.Column<int>(type: "int", nullable: false),
                    NUMORDRE = table.Column<int>(type: "int", nullable: false),
                    VOLOPERATIONNEL = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetailFLs", x => new { x.NUMFL, x.NUMVOL });
                });

            migrationBuilder.CreateIndex(
                name: "IX_DetailFLs_NUMFL",
                table: "DetailFLs",
                column: "NUMFL");

            migrationBuilder.AddForeignKey(
                name: "FK_Equipages_DetailFLs_DetailFLNUMFL_DetailFLNUMVOL",
                table: "Equipages",
                columns: new[] { "DetailFLNUMFL", "DetailFLNUMVOL" },
                principalTable: "DetailFLs",
                principalColumns: new[] { "NUMFL", "NUMVOL" });
        }
    }
}
