import axios from "axios";
import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET(req: NextRequest) {
  try {
    const response = await axios.post(
      'https://api.github.com/repos/atakang7/CronJobs/actions/workflows/keepawake.yml/dispatches',
      {
        ref: 'main', 
      },
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${GITHUB_TOKEN}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}


