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
    public class SegmentRepository
    {
        readonly string _connectionString;

        public SegmentRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Metronome");
        }

        internal IEnumerable<Segment> GetAll()
        {
            using var db = new SqlConnection(_connectionString);

            var segments = db.Query<Segment>(@"SELECT * From Patterns");
            return segments;
        }

        public Segment GetSegmentByID(Guid id)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * FROM Segments 
                        WHERE ID = @ID";
            var result = db.QueryFirstOrDefault<Segment>(sql, new { ID = id });
            return result;
        }

        public bool PatternExists(Guid id)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * FROM Segments
                        WHERE ID = @ID";
            var result = db.QueryFirstOrDefault<Segment>(sql, new { ID = id });
            if (result != null)
            {
                returnVal = true;
            }
            return returnVal;
        }

        internal Guid AddSegment(Segment patternObj)
        {
            using var db = new SqlConnection(_connectionString);
            Guid id = new();
            var sql = @"INSERT INTO Segments (Excerpt, Position, Pattern, Tempo, Repetitions)
                        VALUES (@Excerpt, @Position, @Pattern, @Tempo, @Repetitions)
                        OUTPUT Inserted.ID";
            id = db.ExecuteScalar<Guid>(sql, patternObj);
            if (!id.Equals(Guid.Empty))
            {
                patternObj.ID = id;
            }
            return id;
        }

        internal Segment UpdateSegment(Guid segmentID, Segment segmentObj)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Segments
                            SET ID = @ID,
                            Excerpt = @Excerpt,
                            Position = @Position,
                            Pattern = @Pattern,
                            Tempo = @Tempo,
                            Repetitions = @Repetitions
                        OUTPUT Inserted.*
                        WHERE ID = @ID";

            var parameters = new
            {
                ID = segmentID,
                Excerpt = segmentObj.Excerpt,
                Position = segmentObj.Position,
                Pattern = segmentObj.Pattern,
                Tempo = segmentObj.Tempo,
                Repetitions = segmentObj.Repetitions
            };

            var result = db.QuerySingleOrDefault<Segment>(sql, parameters);
            return result;
        }

        internal bool DeleteSegment(Guid segmentID)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"DELETE from Segments 
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

