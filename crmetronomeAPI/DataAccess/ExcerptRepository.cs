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
    public class ExcerptRepository
    {
        readonly string _connectionString;

        public ExcerptRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Metronome");
        }

        internal IEnumerable<Excerpt> GetAll()
        {
            using var db = new SqlConnection(_connectionString);

            var segments = db.Query<Excerpt>(@"SELECT * From Excerpts");
            return segments;
        }

        public Excerpt GetExcerptByID(Guid id)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * FROM Excerpts 
                        WHERE ID = @ID";
            var result = db.QueryFirstOrDefault<Excerpt>(sql, new { ID = id });
            return result;
        }

        public bool ExcerptExists(Guid id)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * FROM Excerpts
                        WHERE ID = @ID";
            var result = db.QueryFirstOrDefault<Excerpt>(sql, new { ID = id });
            if (result != null)
            {
                returnVal = true;
            }
            return returnVal;
        }

        internal Guid AddExcerpt(Excerpt patternObj)
        {
            using var db = new SqlConnection(_connectionString);
            Guid id = new();
            var sql = @"INSERT INTO Excerpts (Composition, Movement, Measures, CreatedBy, Shared)
                        OUTPUT Inserted.ID
                        VALUES (@Composition, @Movement, @Measures, @CreatedBy, @Shared)";
            id = db.ExecuteScalar<Guid>(sql, patternObj);
            if (!id.Equals(Guid.Empty))
            {
                patternObj.ID = id;
            }
            return id;
        }

        internal Excerpt UpdateExcerpt(Guid segmentID, Excerpt segmentObj)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Excerpts
                            SET ID = @ID,
                            Composition = @Composition,
                            Movement = @Movement,
                            Measures = @Measures,
                            CreatedBy = @CreatedBy,
                            Shared = @Shared
                        OUTPUT Inserted.*
                        WHERE ID = @ID";

            var parameters = new
            {
                ID = segmentID,
                Composition = segmentObj.Composition,
                Movement = segmentObj.Movement,
                Measures = segmentObj.Measures,
                CreatedBy = segmentObj.CreatedBy,
                Shared = segmentObj.Shared
            };

            var result = db.QuerySingleOrDefault<Excerpt>(sql, parameters);
            return result;
        }

        internal bool DeleteExcerpt(Guid segmentID)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"DELETE from Excerpts 
                        OUTPUT Deleted.Id
                        WHERE ID = @ID";
            var parameter = new
            {
                ID = segmentID
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


