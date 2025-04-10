using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDetailFLAndEquipage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DetailFLs",
                columns: table => new
                {
                    NUMFL = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NUMVOL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CIE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATEVOL = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ESCALEDEP = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ESCALEARR = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NUMORDRE = table.Column<int>(type: "int", nullable: false),
                    DATEDEPPREV = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREBBDEP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREBBARR = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DUREEVOLBB = table.Column<int>(type: "int", nullable: false),
                    HEUREABDEP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HEUREABARR = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DUREEVOLAB = table.Column<int>(type: "int", nullable: false),
                    CARBVOLPREC = table.Column<int>(type: "int", nullable: false),
                    CARBRAVUNITE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CARBRAV = table.Column<int>(type: "int", nullable: false),
                    CARBCOEFCONV = table.Column<float>(type: "real", nullable: false),
                    CARBRAVKG = table.Column<int>(type: "int", nullable: false),
                    CARBJAUGEDEP = table.Column<int>(type: "int", nullable: false),
                    CARBJAUGEARR = table.Column<int>(type: "int", nullable: false),
                    CARBCONSOM = table.Column<int>(type: "int", nullable: false),
                    VOLOPERATIONNEL = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DATEVOLOP = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MAT = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetailFLs", x => x.NUMFL);
                });

            migrationBuilder.CreateTable(
                name: "Equipages",
                columns: table => new
                {
                    MAT = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NUMFL = table.Column<int>(type: "int", nullable: false),
                    CLE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FONCTION = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PILOTEENVOL = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipages", x => x.MAT);
                    table.ForeignKey(
                        name: "FK_Equipages_DetailFLs_NUMFL",
                        column: x => x.NUMFL,
                        principalTable: "DetailFLs",
                        principalColumn: "NUMFL",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Equipages_NUMFL",
                table: "Equipages",
                column: "NUMFL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Equipages");

            migrationBuilder.DropTable(
                name: "DetailFLs");
        }
    }
}
