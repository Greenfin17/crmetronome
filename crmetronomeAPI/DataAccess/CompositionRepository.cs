using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Extensions.Configuration;
using crmetronomeAPI.Models;

namespace crmetronomeAPI.DataAccess
{
    public class CompositionRepository
    {
        readonly string _connectionString;

        public CompositionRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Metronome");
        }

        internal IEnumerable<Composition> GetAll()
        {
            using var db = new SqlConnection(_connectionString);

            var compositions = db.Query<Composition>(@"SELECT * From Compositions");
            return compositions;
        }

        internal Composition GetCompositionByID(Guid compositionID)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Compositions 
                        WHERE ID = @Id";
            var result = db.QueryFirstOrDefault<Composition>(sql, new { Id = compositionID });
            return result;
        }

        internal IEnumerable<Composition> GetCompositionByTitle(string title)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Compositions
                        WHERE Title = @Title";
            var result = db.Query<Composition>(sql, new { Title = title} );
            return result;
        }

        internal bool CompositionExists(Guid Id)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Compositions 
                        WHERE ID = @Id";
            var result = db.QueryFirstOrDefault<Composition>(sql, new { Id = Id });
            if (result != null)
            {
                returnVal = true;
            }
            return returnVal;
        }

        internal Guid AddComposition(Composition compositionObj)
        {
            using var db = new SqlConnection(_connectionString);
            Guid id = new();
            var sql = @"IF NOT EXISTS ( SELECT ID FROM Compositions WHERE Title = @Title)
                        INSERT INTO Compositions (Title, Catalog, Composer, AddedBy, Shared)
                        OUTPUT Inserted.ID
                        VALUES
                       (@Title, @Catalog, @Composer, @AddedBy, @Shared)";
            id = db.ExecuteScalar<Guid>(sql, compositionObj);
            if (!id.Equals(Guid.Empty))
            {
                compositionObj.ID = id;
            }
            return id;
        }

        internal Composition UpdateComposition(Guid compositionID, Composition compositionObj)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Compositions 
                            SET ID = @ID,
                            Title = @Title,
                            Catalog = @Catalog,
                            Composer = @Composer,
                            AddedBy = @AddedBy,
                            Shared = @Shared
                        OUTPUT Inserted.*
                        WHERE ID = @ID";
            var parameters = new
            {
                ID = compositionID,
                Title = compositionObj.Title,
                Catalog = compositionObj.Catalog,
                Composer = compositionObj.Composer,
                AddedBy = compositionObj.AddedBy,
                Shared = compositionObj.Shared,
            };

            var result = db.QuerySingleOrDefault<Composition>(sql, parameters);
            return result;
        }

        internal bool DeleteComposition(Guid compositionID)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"DELETE from Compositions
                        OUTPUT Deleted.Id
                        WHERE ID = @Id";
            var parameter = new
            {
                Id = compositionID
            };
            var result = db.Query(sql, parameter);
            if (result.Any())
            {
                returnVal = true;
            }
            return returnVal;
        }
    }
}
