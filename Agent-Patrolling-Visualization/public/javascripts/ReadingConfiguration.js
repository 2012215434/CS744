function readFile(files, callback) {
    // var files = evt.target.files; // FileList object

    var result = {};
    var regions = [];
    //include all region's agents
    var agents = [];
    // files is a FileList of File objects. List some properties.
    var f = files[0];
    
    
    if (f) {
        var reader = new FileReader();

        reader.onload = function(event) {
            //get all contents in the file
            var contents = event.target.result;

            var re = /^\d+\sX\s\d+(\r\n|\r|\n)\d+(\r\n|\r|\n)(regionID:\s\d(\r\n|\r|\n)(\(\d+,\d+\),\s)*(\(\d,\d\))(\r\n|\r|\n)(\(\d+,\d+\),\s)*(\(\d,\d\))(\r\n|\r|\n)?)+/;
            if (!contents.match(re)) return callback(false, 'The format is incorrect, please have a check');
            
            var lines = contents.split('\n');

            var dimension = lines[0].split('X');
            var width = dimension[0].trim();
            var length = dimension[1].trim();
            
            result['width'] = parseInt(width);
            result['height'] = parseInt(length);

            var i;
            var numberOfRegions = parseInt(lines[1]);
            
            for (i = 2; i + 1 < lines.length; i = i + 3) {
                var regionID = parseInt(lines[i].split(':')[1].trim());
                var positions = [];
                var p = lines[i + 1].split(', ');
                
                var j;
                for (j = 0; j < p.length; j++) {
                    var coordinate = p[j].split(',');
                    var row = coordinate[0].substring(1);
                    var column = coordinate[1].substring(0, 1);
                    var position = {};
                    position['row'] = parseInt(row);
                    position['column'] = parseInt(column);
                    positions.push(position);
                }
                //add to regions, positions represent a positions in a region
                regions.push(positions);

                // the agents in one region
                var agent = [];
                var a = lines[i + 2].split(', ');
                for (j = 0; j < a.length; j++) {
                    var coordinate = a[j].split(',');
                    var row = coordinate[0].substring(1);
                    var column = coordinate[1].substring(0, 1);
                    var position = {};
                    position['row'] = parseInt(row);
                    position['column'] = parseInt(column);
                    agent.push(position);
                }
                agents.push(agent);
            }
            //all regions as an value in the result
            result['regions'] = regions;
            result['agents'] = agents;
            
            callback(result);
            console.log(result);
            // return result;
        };
        reader.readAsText(f);
    }
}

export {readFile};