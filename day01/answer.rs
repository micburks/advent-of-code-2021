use std::{fs, env};

fn main() -> () {
    let input_path: String = match env::args().nth(1) {
        Some(p) => p,
        None => {
            println!("no input path");
            return;
        },
    };
    let file: String = match fs::read_to_string(input_path) {
        Ok(p) => p,
        Err(e) => {
            println!("could not read input file: {}", e);
            return;
        },
    };

    let values = file.lines().map(|line| line.parse::<i32>().unwrap());
    let skipped = values.clone().skip(1);
    let zipped = values.clone().zip(skipped);
    let mut total = 0;
    let mut increased = 0;
    let mut decreased = 0;
    let mut stayed = 0;
    for (prev, curr) in zipped {
        total += 1;
        if prev < curr {
            increased += 1;
        } else if prev > curr {
            decreased += 1;
        } else {
            stayed += 1;
        }
    }
    println!("Results ({}):\n\tIncreased: {}\n\tDecreased: {}\n\tStayed: {}", total, increased, decreased, stayed);

    let vals: Vec<i32> = values.collect();
    let total = vals.len();
    let mut increased = 0;
    let mut decreased = 0;
    let mut stayed = 0;
    for i in 3..vals.len() {
        let group_a = vals[i - 3] + vals[i - 2] + vals[i - 1];
        let group_b = vals[i - 2] + vals[i - 1] + vals[i];
        if group_a < group_b {
            increased += 1;
        } else if group_a > group_b {
            decreased += 1;
        } else {
            stayed += 1;
        }
    }
    println!("Group results ({}):\n\tIncreased: {}\n\tDecreased: {}\n\tStayed: {}", total, increased, decreased, stayed);
}
