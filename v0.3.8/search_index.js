var documenterSearchIndex = {"docs":
[{"location":"api/#API","page":"API","title":"API","text":"","category":"section"},{"location":"api/#Checkpoints","page":"API","title":"Checkpoints","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Modules = [Checkpoints]\nPublic = true\nPrivate = true\nPages = [\"Checkpoints.jl\"]","category":"page"},{"location":"api/#Checkpoints.Checkpoints","page":"API","title":"Checkpoints.Checkpoints","text":"Checkpoints\n\nA very minimal module for defining checkpoints or save location in large codebase with the ability to configure how those checkpoints save data externally (similar to how Memento.jl works for logging).\n\n\n\n\n\n","category":"module"},{"location":"api/#Checkpoints.available-Tuple{}","page":"API","title":"Checkpoints.available","text":"available() -> Vector{String}\n\nReturns a vector of all available (registered) checkpoints.\n\n\n\n\n\n","category":"method"},{"location":"api/#Checkpoints.checkpoint-Tuple{String, Dict{Symbol, V} where V}","page":"API","title":"Checkpoints.checkpoint","text":"checkpoint([prefix], name, data)\ncheckpoint([prefix], name, data::Pair...)\ncheckpoint([prefix], name, data::Dict)\n\nDefines a data checkpoint with a specified label and values data. By default checkpoints are no-ops and need to be explicitly configured.\n\ncheckpoint(session, data)\ncheckpoint(handler, name, data::Dict)\n\nAlternatively, you can also checkpoint with to a session which stages the data to be commited later by commit!(session). Explicitly calling checkpoint on a handler is generally not advised, but is an option.\n\n\n\n\n\n","category":"method"},{"location":"api/#Checkpoints.config-Tuple{Checkpoints.Handler, Vector{String}}","page":"API","title":"Checkpoints.config","text":"config(handler::Handler, labels::Vector{String})\nconfig(handler::Handler, prefix::String)\nconfig(labels::Vector{String}, args...; kwargs...)\nconfig(prefix::String, args...; kwargs...)\n\nConfigures the specified checkpoints with a Handler. If the first argument is not a Handler then all args and kwargs are passed to a Handler constructor for you.\n\n\n\n\n\n","category":"method"},{"location":"api/#Checkpoints.register","page":"API","title":"Checkpoints.register","text":"register([prefix], labels)\n\nRegisters a checkpoint that may be configured at a later time.\n\n\n\n\n\n","category":"function"},{"location":"api/#Checkpoints.with_checkpoint_tags-Tuple{Function, Vararg{Pair, N} where N}","page":"API","title":"Checkpoints.with_checkpoint_tags","text":"with_checkpoint_tags(f::Function, context_tags::Pair...)\nwith_checkpoint_tags(f::Function, context_tags::NamedTuple)\n\nRuns the function f, tagging any checkpoints created by f with the context_tags. This is normally used via the do-block form: For example\n\nwith_checkpoint_tags(:foo=>1, :bar=>2) do\n    q_out = qux()\n    checkpoint(\"foobar\"; :output=q_out)\nend\n\nThis snippet will result in \"foobar\" checkpoint having the foo=1 and bar=2 tags, as will any checkpoints created by qux(). The context tags are dynamically scoped and so are retained through function calls.\n\nNested contexts (nested with_checkpoint_tags calls) are allowed. Duplicate tag names and values are allowed, including the tags provided directly in the checkpoint call. Duplicate tags are repeated, not overwritten.\n\n\n\n\n\n","category":"method"},{"location":"#Checkpoints","page":"Home","title":"Checkpoints","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"(Image: stable) (Image: build status) (Image: coverage)","category":"page"},{"location":"","page":"Home","title":"Home","text":"Let's begin by creating a module (or package) that contains data we may want to save (or checkpoint).","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> module TestPkg\n\n       using Checkpoints: register, checkpoint, Session\n\n       # We aren't using `@__MODULE__` because that would return TestPkg on 0.6 and Main.TestPkg on 0.7\n       const MODULE = \"TestPkg\"\n\n       __init__() = register(MODULE, [\"foo\", \"bar\", \"baz\"])\n\n       function foo(x::Matrix, y::Matrix)\n           # Save multiple variables to 1 foo.jlso file by passing in pairs of variables\n           checkpoint(MODULE, \"foo\", :x => x, :y => y)\n           return x * y\n       end\n\n       function bar(a::Vector)\n           # Save a single value for bar.jlso. The object name in that file defaults to \"date\".\n           # Any context tags will be appended to the handler path passed to config.\n           # In this case the path would be `<prefix>/date=2017-01-01/TestPkg/bar.jlso`\n           with_checkpoint_tags(:date => \"2017-01-01\") do\n               checkpoint(MODULE, \"bar\", a)\n           end\n           return a * a'\n       end\n\n       function baz(data::Dict)\n            # Check that saving multiple values to a Session works.\n            Session(MODULE, \"baz\") do s\n                for (k, v) in data\n                    checkpoint(s, k => v)\n                end\n            end\n        end\n    end\n\nTestPkg","category":"page"},{"location":"#Basic-Checkpointing","page":"Home","title":"Basic Checkpointing","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Now we get a list of all available checkpoints outside our module.","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> using Checkpoints\n\njulia> Checkpoints.available()\n2-element Array{String,1}:\n \"TestPkg.bar\"\n \"TestPkg.foo\"\n \"TestPkg.baz\"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Let's start by looking at TestPkg.foo","category":"page"},{"location":"#Package","page":"Home","title":"Package","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"As a reference, here is the sample code for TestPkg.foo that we'll be calling.","category":"page"},{"location":"","page":"Home","title":"Home","text":"...\nfunction foo(x::Matrix, y::Matrix)\n    # Save multiple variables to 1 foo.jlso file by passing in pairs of variables\n    checkpoint(MODULE, \"foo\", :x => x, :y => y)\n    return x * y\nend\n...","category":"page"},{"location":"#Application","page":"Home","title":"Application","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"We can run our function TestPkg.foo normally without saving any data.","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> TestPkg.foo(rand(5, 5), rand(5, 5))\n5×5 Array{Float64,2}:\n 0.968095  1.18687  1.55126  0.393847  0.854391\n 0.839788  1.1527   1.36785  0.361546  0.818136\n 1.44853   1.5996   2.17535  0.567696  1.31739\n 1.08267   1.74522  2.28862  0.673888  1.35935\n 0.755876  1.62275  2.24326  0.727734  1.13352","category":"page"},{"location":"","page":"Home","title":"Home","text":"Now we just need to assign a backend handler for our checkpoints. In our case, all checkpoints with the prefix \"TestPkg.foo\".","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> Checkpoints.config(\"TestPkg.foo\", \"./checkpoints\")","category":"page"},{"location":"","page":"Home","title":"Home","text":"To confirm that our checkpoints work let's assign our expected x and `y values to local variables.","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> x = rand(5, 5)\n5×5 Array{Float64,2}:\n 0.605955  0.314332  0.666603   0.997074  0.106063\n 0.691509  0.438608  0.121533   0.931504  0.127145\n 0.704745  0.640941  0.237085   0.333055  0.648672\n 0.911475  0.410938  0.0143505  0.257862  0.0238969\n 0.956029  0.593267  0.0334345  0.374615  0.0301007\n\njulia> y = rand(5, 5)\n5×5 Array{Float64,2}:\n 0.245635  0.211488  0.122208   0.917927  0.736712\n 0.556079  0.837774  0.0845954  0.812386  0.478323\n 0.661403  0.307322  0.015631   0.150063  0.765874\n 0.949725  0.332881  0.667242   0.468574  0.223302\n 0.723806  0.682948  0.511228   0.635479  0.879735","category":"page"},{"location":"","page":"Home","title":"Home","text":"Finally, rerun TestPkg.foo and inspect the generated file","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> TestPkg.foo(x, y)\n5×5 Array{Float64,2}:\n 1.78824   1.0007    0.830574  1.44622  1.42326\n 1.47084   0.947963  0.81005   1.52659  1.13218\n 1.47216   1.31275   0.697899  1.77145  1.65238\n 0.724089  0.643606  0.33065   1.30867  0.95765\n 0.964419  0.854747  0.432891  1.55921  1.12383\n\njulia> isfile(\"checkpoints/TestPkg/foo.jlso\")\ntrue\n\njulia> using JLSO\n\njulia> d = JLSO.load(\"checkpoints/TestPkg/foo.jlso\")\nDict{String,Any} with 2 entries:\n  \"x\" => [0.605955 0.314332 … 0.997074 0.106063; 0.691509 0.438608 … 0.931504 0.127145; … ; 0.911475 0.410938 … 0.257862 0.0238969; 0.956029…\n  \"y\" => [0.245635 0.211488 … 0.917927 0.736712; 0.556079 0.837774 … 0.812386 0.478323; … ; 0.949725 0.332881 … 0.468574 0.223302; 0.723806 …\n\njulia> d[\"x\"]\n5×5 Array{Float64,2}:\n 0.605955  0.314332  0.666603   0.997074  0.106063\n 0.691509  0.438608  0.121533   0.931504  0.127145\n 0.704745  0.640941  0.237085   0.333055  0.648672\n 0.911475  0.410938  0.0143505  0.257862  0.0238969\n 0.956029  0.593267  0.0334345  0.374615  0.0301007\n","category":"page"},{"location":"","page":"Home","title":"Home","text":"As we can see, the value of x was successfully saved to checkpoints/MyPkg/foo.jlso.","category":"page"},{"location":"#Tags","page":"Home","title":"Tags","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Tags can be used to append the handler path at runtime.","category":"page"},{"location":"#Package-2","page":"Home","title":"Package","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"As a reference, here is the sample code for TestPkg.bar that we'll be calling.","category":"page"},{"location":"","page":"Home","title":"Home","text":"...\nfunction bar(a::Vector)\n    # Save a single value for bar.jlso. The object name in that file defaults to \"date\".\n    # Any context tags will be appended to the handler path passed to config.\n    # In this case the path would be `<prefix>/date=2017-01-01/TestPkg/bar.jlso`\n    with_checkpoint_tags(:date => \"2017-01-01\") do\n        checkpoint(MODULE, \"bar\", a)\n    end\n    return a * a'\nend\n...","category":"page"},{"location":"#Application-2","page":"Home","title":"Application","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"\njulia> a = rand(10)\n10-element Array{Float64,1}:\n 0.166881\n 0.817174\n 0.413097\n 0.955415\n 0.139473\n 0.49518\n 0.416731\n 0.431096\n 0.126912\n 0.600469\n\njulia> Checkpoints.config(\"TestPkg.bar\", \"./checkpoints\")\n\njulia> JLSO.load(\"./checkpoints/date=2017-01-01/TestPkg/bar.jlso\")\nDict{String,Any} with 1 entry:\n  \"data\" => [0.166881, 0.817174, 0.413097, 0.955415, 0.139473, 0.49518, 0.416731, 0.431096, 0.126912, 0.600469]","category":"page"},{"location":"#Tag-Context","page":"Home","title":"Tag Context","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"It is possible to introduce a tag context, such that all the checkpoint operations inside the context are tagged with the given tags. The context is dynamically scoped, meaning that the tags persist through function calls. Tag contexts can be nested and can be used inside the package as well as in the application.","category":"page"},{"location":"","page":"Home","title":"Home","text":"For example:","category":"page"},{"location":"","page":"Home","title":"Home","text":"with_checkpoint_tags(:tag=>1, :othertag=>2) do\n    bar([1., 2., 3.])\nend","category":"page"},{"location":"","page":"Home","title":"Home","text":"will result in recording the checkpoint at \"./checkpoints/tag=1/othertag=2/date=2017-01-01/TestPkg/bar.jlso\" without having to pass :tag and :othertag directly to bar.","category":"page"},{"location":"#Sessions","page":"Home","title":"Sessions","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"If you'd like to iteratively checkpoint data (e.g., in a loop) then we recommend using a session.","category":"page"},{"location":"#Package-3","page":"Home","title":"Package","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"As a reference, here is the sample code for TestPkg.baz that we'll be calling.","category":"page"},{"location":"","page":"Home","title":"Home","text":"...\nfunction baz(data::Dict)\n    # Check that saving multiple values to a Session works.\n    Session(MODULE, \"baz\") do s\n        for (k, v) in data\n            checkpoint(s, k => v)\n        end\n    end\nend\n...","category":"page"},{"location":"#Application-3","page":"Home","title":"Application","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"julia> d = Dict(:x => rand(10), :y => rand(10))\nDict{String,Array{Float64,1}} with 2 entries:\n  :x => [0.517666, 0.976474, 0.961658, 0.0933946, 0.877478, 0.428836, 0.0623459, 0.548001, 0.437111, 0.0783503]\n  :y => [0.0623591, 0.0441436, 0.28578, 0.289995, 0.999642, 0.26299, 0.965148, 0.899285, 0.292166, 0.595886]\n\njulia> TestPkg.baz(d)\n\njulia> JLSO.load(\"./checkpoints/TestPkg/baz.jlso\")\nDict{String,Any} with 2 entries:\n  \"x\" => [0.517666, 0.976474, 0.961658, 0.0933946, 0.877478, 0.428836, 0.0623459, 0.548001, 0.437111, 0.0783503]\n  \"y\" => [0.0623591, 0.0441436, 0.28578, 0.289995, 0.999642, 0.26299, 0.965148, 0.899285, 0.292166, 0.595886]","category":"page"},{"location":"#Load-Failures","page":"Home","title":"Load Failures","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"What if I can't load my .jlso files?","category":"page"},{"location":"","page":"Home","title":"Home","text":"If you're julia environment doesn't match the one used to save .jlso file (e.g., different julia version or missing packages) then you may get errors.","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> using Checkpoints, JLSO\n[ Info: Recompiling stale cache file /Users/rory/.playground/share/checkpoints/depot/compiled/v1.0/Checkpoints/E2USV.ji for Checkpoints [08085054-0ffc-5852-afcc-fc6ba29efde0]\n\njulia> d = JLSO.load(\"checkpoints/TestPkg/foo.jlso\")\n[warn | JLSO]: EOFError: read end of file\n[warn | JLSO]: EOFError: read end of file\nDict{String,Any} with 2 entries:\n  \"x\" => UInt8[0x15, 0x00, 0x0e, 0x14, 0x02, 0xca, 0xca, 0x32, 0x20, 0x7b  …  0x98, 0x3f, 0xc6, 0xc9, 0x58, 0xc8, 0xb7, 0xd2, 0x9e, 0x3f]\n  \"y\" => UInt8[0x15, 0x00, 0x0e, 0x14, 0x02, 0xca, 0xca, 0xfe, 0x60, 0xe0  …  0xcc, 0x3f, 0x9f, 0xb0, 0xc4, 0x03, 0xca, 0x26, 0xec, 0x3f]","category":"page"},{"location":"","page":"Home","title":"Home","text":"In this case, we should try manually loading the JLSO.JLSOFile and inspect the metadata saved with the file.","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> jlso = open(\"checkpoints/TestPkg/foo.jlso\") do io\n           read(io, JLSO.JLSOFile)\n       end\nJLSOFile([x, y]; version=v\"1.0.0\", julia=v\"0.6.4\", format=:serialize, image=\"\")\n\njulia> VERSION\nv\"1.0.0\"","category":"page"},{"location":"","page":"Home","title":"Home","text":"As we can see, our .jlso file was saved in julia v0.6.4 and we're trying to load in on julia v1.0. If you still have difficulty loading the file when the julia versions match then you may want to inspect the package versions installed when saving the file.","category":"page"},{"location":"","page":"Home","title":"Home","text":"julia> jlso.pkgs\nDict{String,VersionNumber} with 60 entries:\n  \"Coverage\"            => v\"0.6.0\"\n  \"HTTP\"                => v\"0.6.15\"\n  \"LegacyStrings\"       => v\"0.4.0\"\n  \"Nullables\"           => v\"0.0.8\"\n  \"AxisArrays\"          => v\"0.2.1\"\n  \"Compat\"              => v\"1.2.0\"\n  \"DataStructures\"      => v\"0.8.4\"\n  \"CategoricalArrays\"   => v\"0.3.14\"\n  \"Calculus\"            => v\"0.4.1\"\n  \"DeepDiffs\"           => v\"1.1.0\"\n  \"StatsFuns\"           => v\"0.6.1\"\n  \"JLD2\"                => v\"0.0.6\"\n  \"DataFrames\"          => v\"0.11.7\"\n  \"SpecialFunctions\"    => v\"0.6.0\"\n  \"TranscodingStreams\"  => v\"0.5.4\"\n  \"Blosc\"               => v\"0.5.1\"\n  \"Distributions\"       => v\"0.15.0\"\n  \"SHA\"                 => v\"0.5.7\"\n  \"Missings\"            => v\"0.2.10\"\n  \"SymDict\"             => v\"0.2.1\"\n  \"CodecZlib\"           => v\"0.4.4\"\n  \"HDF5\"                => v\"0.9.5\"\n  \"AWSCore\"             => v\"0.3.9\"\n  \"Retry\"               => v\"0.2.0\"\n  \"MbedTLS\"             => v\"0.5.13\"\n  \"FileIO\"              => v\"0.9.1\"\n  \"Mocking\"             => v\"0.5.7\"\n  \"TimeZones\"           => v\"0.8.0\"\n  \"BSON\"                => v\"0.1.4\"\n  \"PDMats\"              => v\"0.8.0\"\n  \"BenchmarkTools\"      => v\"0.3.2\"\n  \"SortingAlgorithms\"   => v\"0.2.1\"\n  \"WeakRefStrings\"      => v\"0.4.7\"\n  \"Memento\"             => v\"0.10.0\"\n  \"Syslogs\"             => v\"0.2.0\"\n  \"JSON\"                => v\"0.17.2\"\n  \"StatsBase\"           => v\"0.23.1\"\n  \"DocStringExtensions\" => v\"0.4.6\"\n  \"Checkpoints\"         => v\"0.0.0-\"\n  \"QuadGK\"              => v\"0.3.0\"\n  \"BinDeps\"             => v\"0.8.10\"\n  \"RangeArrays\"         => v\"0.3.1\"\n  \"Parameters\"          => v\"0.9.2\"\n  \"Reexport\"            => v\"0.1.0\"\n  \"CMakeWrapper\"        => v\"0.1.0\"\n  \"URIParser\"           => v\"0.3.1\"\n  \"XMLDict\"             => v\"0.1.3\"\n  \"Documenter\"          => v\"0.19.6\"\n  \"IntervalSets\"        => v\"0.3.0\"\n  \"DataStreams\"         => v\"0.3.6\"\n  \"JLD\"                 => v\"0.8.3\"\n  \"Rmath\"               => v\"0.4.0\"\n  \"BinaryProvider\"      => v\"0.3.3\"\n  \"IterTools\"           => v\"0.2.1\"\n  \"IniFile\"             => v\"0.4.0\"\n  \"AWSSDK\"              => v\"0.3.1\"\n  \"NamedTuples\"         => v\"4.0.2\"\n  \"AWSS3\"               => v\"0.3.7\"\n  \"Homebrew\"            => v\"0.6.4\"\n  \"LightXML\"            => v\"0.7.0\"","category":"page"}]
}