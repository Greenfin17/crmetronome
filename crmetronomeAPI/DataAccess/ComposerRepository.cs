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
    public class ComposerRepository
    {
        readonly string _connectionString;

        public ComposerRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("Metronome");
        }

        internal IEnumerable<Composer> GetAll()
        {
            using var db = new SqlConnection(_connectionString);

            var composers = db.Query<Composer>(@"SELECT * From Composers");
            return composers;
        }

        internal Composer GetComposerById(Guid userId)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Composers 
                        WHERE ID = @Id";
            var result = db.QueryFirstOrDefault<Composer>(sql, new { Id = userId });
            return result;
        }

        internal IEnumerable<Composer> GetComposerByLast(string last)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Composers
                        WHERE Last = @Last";
            var result = db.Query<Composer>(sql, new { Last = last });
            return result;
        }

        internal bool ComposerExists(Guid Id)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"SELECT * from Composers 
                        WHERE ID = @Id";
            var result = db.QueryFirstOrDefault<Composer>(sql, new { Id });
            if (result != null)
            {
                returnVal = true;
            }
            return returnVal;
        }

        internal Guid AddComposer (Composer composerObj)
        {
            using var db = new SqlConnection(_connectionString);
            Guid id = new();
            var sql = @"IF NOT EXISTS ( SELECT ID FROM Composers WHERE Last = @Last AND First = @First)
                        INSERT INTO Composers (AddedBy, Shared, First, Last, Middle, Birth, Death)
                        OUTPUT Inserted.ID
                        VALUES
                       (@AddedBy, @Shared, @First, @Last, @Middle, @Birth, @Death)";
            id = db.ExecuteScalar<Guid>(sql, composerObj);
            if (!id.Equals(Guid.Empty))
            {
                composerObj.ID = id;
            }
            return id;
        }

        internal Composer UpdateComposer(Guid composerID, Composer composerObj)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Composers 
                            SET ID = @ID,
                            AddedBy = @AddedBy,
                            Shared = @Shared,
                            First= @First,
                            Last= @Last,
                            Birth = @Birth,
                            Death = @Death
                        OUTPUT Inserted.*
                        WHERE ID = @ID";
            var parameters = new
            {
                ID = composerID,
                AddedBy = composerObj.AddedBy,
                Shared = composerObj.Shared,
                First = composerObj.First,
                Last = composerObj.Last,
                Birth = composerObj.Birth,
                Death = composerObj.Death
            };

            var result = db.QuerySingleOrDefault<Composer>(sql, parameters);
            return result;
        }
        internal Composer UpdateComposerWithPatch(Composer composerObj)
        {
            using var db = new SqlConnection(_connectionString);
            var sql = @"UPDATE Composers Set ";
            // check for each changed property
            sql += @"Shared = @Shared";
            if (composerObj.First != null)
            {
                sql += ", First = @First";
            }
            if (composerObj.Middle!= null)
            {
                sql += ", Middle = @Middle";
            }
            if (composerObj.Last != null)
            {
                sql += ", Last = @Last";
            }
            if (composerObj.Birth != null)
            {
                sql += ", Birth = @Birth";
            }
            if (composerObj.Death != null)
            {
                sql += ", Death = @Death";
            }
            sql += " Output Inserted.* Where ID = @ID;";
            var result = db.QuerySingleOrDefault<Composer>(sql, composerObj);
            return result;
        }


 

        internal bool DeleteComposer(Guid composerId)
        {
            bool returnVal = false;
            using var db = new SqlConnection(_connectionString);
            var sql = @"DELETE from Composers
                        OUTPUT Deleted.Id
                        WHERE ID = @Id";
            var parameter = new
            {
                Id = composerId
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
