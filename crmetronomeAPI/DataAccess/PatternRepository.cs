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
    public class PatternRepository
    {
        readonly string _connectionString;

        public PatternRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Metronome");
        }

        internal IEnumerable<Composition> GetAll()
        {
            using var db = new SqlConnection(_connectionString);

            var patterns = db.Query<Composition>(@"SELECT * From Patterns");
            return patterns;
        }

        public Pattern GetPatternByID(Guid id)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * FROM Patterns
                        WHERE ID = @ID";
            var result = db.QueryFirstOrDefault<Pattern>(sql, new { ID = id});
            return result;
        }

        public bool PatternExists(Guid id)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * FROM Patterns
                        WHERE ID = @ID";
            var result = db.QueryFirstOrDefault<Pattern>(sql, new { ID = id});
            if (result != null)
            {
                returnVal = true;
            }
            return returnVal;
        }

        internal Guid AddPattern(Pattern patternObj)
        {
            using var db = new SqlConnection(_connectionString);
            Guid id = new();
            var sql = @"IF NOT EXISTS ( SELECT ID FROM Patterns WHERE BeatPattern = @BeatPattern
                            AND CreatedBy = @CreatedBy) INSERT INTO Patterns (BeatPattern, CreatedBy, Shared)
                        VALUES (@CreatedBy, @BeatPattern, @Shared)
                        OUTPUT Inserted.ID";
            id = db.ExecuteScalar<Guid>(sql, patternObj);
            if (!id.Equals(Guid.Empty))
            {
                patternObj.ID = id;
            }
            return id;
        }

        internal Pattern UpdatePattern(Guid patternID, Pattern patternObj)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Patterns 
                            SET ID = @ID,
                            AddedBy = @AddedBy,
                            Pattern = @BeatPattern,
                            Shared = @Shared
                        OUTPUT Inserted.*
                        WHERE ID = @ID";

            var parameter = new
            {
                ID = patternID,
                CreatedBy = patternObj.CreatedBy,
                Pattern = patternObj.BeatPattern
            };

            var result = db.QuerySingleOrDefault<Pattern>(sql, parameter);
            return result;
        }

        internal bool DeletePattern(Guid patternID)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"DELETE from Patterns
                        OUTPUT Deleted.Id
                        WHERE ID = @ID";
            var parameter = new
            {
                ID = patternID
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
